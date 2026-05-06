import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import { verifyToken, COOKIE_NAME } from '../../../../lib/auth';

async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const user = await verifyToken(token);
  if (!user || user.role !== 'SUPER_ADMIN') return null;
  return user;
}

const CreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']).default('ADMIN'),
});

export async function GET() {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  const newUser = await prisma.adminUser.create({
    data: { name: parsed.data.name, email: parsed.data.email, password: hashed, role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(newUser);
}
