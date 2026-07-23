import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role;
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM;

    const diagnostics: Record<string, unknown> = {
      host: smtpHost || 'NOT SET',
      port: smtpPort || 'NOT SET',
      user: smtpUser ? `${smtpUser.substring(0, 3)}***` : 'NOT SET',
      pass: smtpPass ? `${'*'.repeat(smtpPass.length)}` : 'NOT SET',
      from: smtpFrom || 'NOT SET',
      secure: smtpPort === '465',
    };

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({
        success: false,
        error: 'Missing SMTP environment variables',
        diagnostics,
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || '587'),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });

    try {
      await transporter.verify();
      diagnostics.connectionTest = 'PASSED';
    } catch (verifyError: any) {
      diagnostics.connectionTest = 'FAILED';
      diagnostics.connectionError = verifyError.message || String(verifyError);
      return NextResponse.json({
        success: false,
        error: 'SMTP connection failed',
        diagnostics,
      });
    }

    try {
      const testResult = await transporter.sendMail({
        from: smtpFrom || smtpUser,
        to: smtpUser,
        subject: 'Philippine Skyland - SMTP Test',
        html: `
          <h2>SMTP Test Successful</h2>
          <p>If you received this email, your SMTP configuration is working correctly.</p>
          <p><strong>Host:</strong> ${smtpHost}</p>
          <p><strong>Port:</strong> ${smtpPort}</p>
          <p><strong>User:</strong> ${smtpUser}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `,
      });
      diagnostics.sendTest = 'PASSED';
      diagnostics.messageId = testResult.messageId;
    } catch (sendError: any) {
      diagnostics.sendTest = 'FAILED';
      diagnostics.sendError = sendError.message || String(sendError);
      return NextResponse.json({
        success: false,
        error: 'SMTP send test failed',
        diagnostics,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'SMTP is working! Test email sent to ' + smtpUser,
      diagnostics,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error.message || String(error),
    }, { status: 500 });
  }
}
