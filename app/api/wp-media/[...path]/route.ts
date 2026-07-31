import { NextRequest } from 'next/server';
import https from 'https';
import http from 'http';
import { IncomingMessage } from 'http';

const OLD_IP = '69.62.80.189';
const OLD_HOST = 'www.heliosevent.in';
const FETCH_TIMEOUT_MS = 6000;
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|gif|webp|svg|pdf|mp4)$/i;

function fetchFromIP(protocol: 'https' | 'http', filePath: string): Promise<{ data: Buffer; contentType: string; status: number }> {
  return new Promise((resolve, reject) => {
    const mod = protocol === 'https' ? https : http;
    const port = protocol === 'https' ? 443 : 80;
    const req = (mod as typeof https).request(
      {
        hostname: OLD_IP,
        port,
        path: `/wp-content/uploads/${filePath}`,
        method: 'GET',
        headers: { Host: OLD_HOST },
        rejectUnauthorized: false,
        timeout: FETCH_TIMEOUT_MS,
      },
      (res: IncomingMessage) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () =>
          resolve({
            data: Buffer.concat(chunks),
            contentType: (res.headers['content-type'] as string) || 'image/jpeg',
            status: res.statusCode || 200,
          })
        );
      }
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end();
  });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const filePath = path.join('/');

  // Old media uploads were only ever these file types — anything else (.php, wp-admin
  // probes, etc.) is a scanner/bot request; reject instantly without hitting the legacy host.
  if (!ALLOWED_EXTENSIONS.test(filePath)) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'public, max-age=86400' },
    });
  }

  let result: { data: Buffer; contentType: string; status: number } | null = null;

  // Try HTTPS first (old server may redirect HTTP→HTTPS)
  try {
    result = await fetchFromIP('https', filePath);
  } catch {
    // Fall back to HTTP
    try {
      result = await fetchFromIP('http', filePath);
    } catch (e) {
      return new Response('Error fetching media', {
        status: 502,
        headers: { 'Cache-Control': 'public, max-age=300' },
      });
    }
  }

  if (!result || result.status >= 400) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Cache-Control': 'public, max-age=86400' },
    });
  }

  return new Response(result.data.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': result.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
