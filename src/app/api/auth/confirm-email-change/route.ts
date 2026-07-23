import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logInfo, logError } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/auth/login?error=invalid-token', request.url));
    }

    const user = await prisma.user.findFirst({
      where: { emailChangeToken: token },
      select: { id: true, email: true, pendingEmail: true },
    });

    if (!user || !user.pendingEmail) {
      return NextResponse.redirect(new URL('/auth/login?error=invalid-token', request.url));
    }

    const emailTaken = await prisma.user.findUnique({
      where: { email: user.pendingEmail },
      select: { id: true },
    });

    if (emailTaken) {
      return NextResponse.redirect(new URL('/auth/login?error=email-taken', request.url));
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        emailChangeToken: null,
        pendingEmail: null,
      },
    });

    logInfo('Email change confirmed', { userId: user.id, newEmail: user.pendingEmail });

    return NextResponse.redirect(new URL('/auth/login?message=email-changed', request.url));
  } catch (error) {
    logError('Email change confirmation failed', { error: String(error) });
    return NextResponse.redirect(new URL('/auth/login?error=server-error', request.url));
  }
}
