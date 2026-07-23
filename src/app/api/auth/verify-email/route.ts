import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logInfo, logError } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token || token.length < 10) {
      return NextResponse.redirect(new URL('/auth/login?error=invalid-token', request.url));
    }

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?error=invalid-token', request.url));
    }

    if (user.isEmailVerified) {
      return NextResponse.redirect(new URL('/auth/login?message=already-verified', request.url));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    logInfo('Email verified successfully', { userId: user.id });

    return NextResponse.redirect(new URL('/auth/login?message=verified', request.url));

  } catch (error) {
    logError('Email verification failed', { error: String(error) });
    return NextResponse.redirect(new URL('/auth/login?error=verification-failed', request.url));
  }
}
