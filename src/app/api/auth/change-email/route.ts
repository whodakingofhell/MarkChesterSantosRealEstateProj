import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { apiLimiter } from '@/lib/rate-limit';
import { logInfo, logError } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { newEmail } = await request.json();

    if (!newEmail || typeof newEmail !== 'string') {
      return NextResponse.json({ error: 'New email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const normalizedEmail = newEmail.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json({ error: 'This email is already in use' }, { status: 409 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.email === normalizedEmail) {
      return NextResponse.json({ error: 'New email is the same as current email' }, { status: 400 });
    }

    const confirmToken = crypto.randomUUID();

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailChangeToken: confirmToken,
        pendingEmail: normalizedEmail,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://philippine-skyland.vercel.app';
    const confirmUrl = `${appUrl}/api/auth/confirm-email-change?token=${confirmToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .btn { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .note { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 12px; margin: 16px 0; font-size: 14px; color: #475569; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirm Email Change</h1>
          </div>
          <div class="content">
            <p>You requested to change your email address on Philippine Skyland.</p>
            <p><strong>From:</strong> ${user.email}</p>
            <p><strong>To:</strong> ${normalizedEmail}</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}" class="btn">Confirm Email Change</a>
            </p>
            <div class="note">
              <p><strong>This link expires in 1 hour.</strong> If you did not request this change, please ignore this email and consider changing your password.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Philippine Skyland MGT and DEVT OPC (PPSMDO). All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Confirm Email Change - Philippine Skyland',
      html,
    });

    logInfo('Email change requested', { userId, newEmail: normalizedEmail });

    return NextResponse.json({
      success: true,
      message: `A confirmation email has been sent to ${user.email}. Please check your inbox to confirm the change.`,
    });
  } catch (error) {
    logError('Email change request failed', { error: String(error) });
    return NextResponse.json({ error: 'Failed to process email change' }, { status: 500 });
  }
}
