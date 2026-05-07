import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const filePath = path.join('/');

  try {
    const response = await fetch(`http://69.62.80.189/wp-content/uploads/${filePath}`, {
      headers: { Host: 'www.heliosevent.in' },
    });

    if (!response.ok) return new Response('Not found', { status: 404 });

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Error fetching media', { status: 500 });
  }
}
