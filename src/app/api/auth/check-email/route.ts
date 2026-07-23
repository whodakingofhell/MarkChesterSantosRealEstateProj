import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ exists: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        isEmailVerified: true,
        isActive: true,
        lockedUntil: true,
      },
    });

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      isEmailVerified: user.isEmailVerified,
      isActive: user.isActive,
      isLocked: user.lockedUntil ? user.lockedUntil > new Date() : false,
    });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
