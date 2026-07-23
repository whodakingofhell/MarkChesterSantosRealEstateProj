import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import { apiLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;

  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        isEmailVerified: true,
        emailVerificationToken: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        message: 'If an account with that email exists, a verification link has been sent.',
      });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        message: 'This email is already verified. You can sign in.',
      });
    }

    let token = user.emailVerificationToken;
    if (!token) {
      token = crypto.randomUUID();
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerificationToken: token },
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://philippine-skyland.vercel.app';
    await sendVerificationEmail(user.email, user.name, token, appUrl);

    return NextResponse.json({
      message: 'If an account with that email exists, a verification link has been sent.',
    });
  } catch {
    return NextResponse.json({
      message: 'If an account with that email exists, a verification link has been sent.',
    });
  }
}
