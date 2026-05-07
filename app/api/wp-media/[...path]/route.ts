import { NextRequest } from 'next/server';
import https from 'https';
import http from 'http';
import { IncomingMessage } from 'http';

const OLD_IP = '69.62.80.189';
const OLD_HOST = 'www.heliosevent.in';

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
    req.on('error', reject);
    req.end();
  });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const filePath = path.join('/');

  let result: { data: Buffer; contentType: string; status: number } | null = null;

  // Try HTTPS first (old server may redirect HTTP→HTTPS)
  try {
    result = await fetchFromIP('https', filePath);
  } catch {
    // Fall back to HTTP
    try {
      result = await fetchFromIP('http', filePath);
    } catch (e) {
      return new Response('Error fetching media', { status: 500 });
    }
  }

  if (!result || result.status >= 400) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(result.data.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': result.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
