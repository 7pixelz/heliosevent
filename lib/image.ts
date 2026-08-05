/**
 * Resizes + re-encodes an uploaded image to webp at upload time, so raw
 * oversized files never reach storage. Non-image files (video) and svg pass
 * through untouched; a corrupt/unparseable image falls back to the original
 * bytes rather than failing the upload.
 */

import sharp from 'sharp';

export interface OptimizeOptions {
  maxWidth: number;
  quality?: number;
}

export interface OptimizedFile {
  body: Buffer;
  contentType: string;
  ext: string;
}

export async function optimizeImage(file: File, opts: OptimizeOptions): Promise<OptimizedFile> {
  const original: OptimizedFile = {
    body: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
    ext: file.name.split('.').pop()?.toLowerCase() || (file.type.startsWith('video/') ? 'mp4' : 'jpg'),
  };

  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return original;

  try {
    const body = await sharp(original.body)
      .rotate()
      .resize({ width: opts.maxWidth, withoutEnlargement: true })
      .webp({ quality: opts.quality ?? 78 })
      .toBuffer();
    return { body, contentType: 'image/webp', ext: 'webp' };
  } catch {
    return original;
  }
}
