/**
 * Rewrites a Supabase Storage public URL to use the built-in image transform
 * endpoint, which resizes and recompresses on the CDN edge — no re-upload needed.
 *
 * Original:  .../storage/v1/object/public/<bucket>/<path>
 * Transform: .../storage/v1/render/image/public/<bucket>/<path>?width=W&quality=Q
 *
 * Falls back to the original URL if it's not a Supabase storage URL.
 */
export function sbImg(url: string, width: number, quality = 80): string {
  if (!url) return url;
  const transformed = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  );
  if (transformed === url) return url; // not a Supabase storage URL
  return `${transformed}?width=${width}&quality=${quality}`;
}
