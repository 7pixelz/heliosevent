import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// One custom domain per public R2 bucket, set up in Phase 0. `career-resumes`
// is private and has no entry — it's only ever accessed via getSignedDownloadUrl.
const PUBLIC_DOMAINS: Record<string, string> = {
  'hero-media': 'hero-media.cdn.heliosevent.in',
  'client-logos': 'client-logos.cdn.heliosevent.in',
  'blog-images': 'blog-images.cdn.heliosevent.in',
  'portfolio-media': 'portfolio-media.cdn.heliosevent.in',
  'service-media': 'service-media.cdn.heliosevent.in',
};

let client: S3Client | null = null;

function r2Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

export async function uploadObject(
  bucket: string,
  key: string,
  body: File | Blob | ArrayBuffer | Uint8Array,
  contentType: string
): Promise<{ error: string | null }> {
  try {
    const bytes = body instanceof Uint8Array
      ? body
      : new Uint8Array(body instanceof ArrayBuffer ? body : await body.arrayBuffer());
    await r2Client().send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bytes,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Upload failed' };
  }
}

export function getPublicUrl(bucket: string, key: string): string {
  const domain = PUBLIC_DOMAINS[bucket];
  if (!domain) throw new Error(`No public domain configured for bucket "${bucket}"`);
  return `https://${domain}/${key}`;
}

export async function removeObjects(bucket: string, keys: string[]): Promise<void> {
  if (!keys.length) return;
  await r2Client().send(new DeleteObjectsCommand({
    Bucket: bucket,
    Delete: { Objects: keys.map(Key => ({ Key })) },
  }));
}

export async function getSignedDownloadUrl(
  bucket: string,
  key: string,
  expiresInSeconds: number
): Promise<string> {
  return getSignedUrl(
    r2Client(),
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expiresInSeconds }
  );
}
