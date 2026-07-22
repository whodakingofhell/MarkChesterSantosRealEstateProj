import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { compare, hash } from 'bcryptjs';
import { logError } from '@/lib/logger';
import { apiLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least one uppercase letter' }, { status: 400 });
    }

    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least one lowercase letter' }, { status: 400 });
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least one number' }, { status: 400 });
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least one special character' }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'New password must be different from current password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValid = await compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const newHash = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    logError('Failed to change password', { error: String(error) });
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
