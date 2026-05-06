import { SignJWT, jwtVerify } from 'jose';

const key = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface AdminPayload {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = 'helios_admin_token';
