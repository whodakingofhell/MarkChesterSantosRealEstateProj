import { NextRequest, NextResponse } from 'next/server';
import { contactSubmissionSchema } from '@/lib/validation';
import { sendContactNotification } from '@/lib/email';
import { logInfo, logError } from '@/lib/logger';
import { contactLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rateLimited = await contactLimiter(request);
  if (rateLimited) return rateLimited;
  const requestId = crypto.randomUUID();
  
  try {
    const body = await request.json();
    
    const validation = contactSubmissionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    
    const professionalEmail = process.env.SMTP_USER || 'nelsonaczon@gmail.com';
    
    const emailSent = await sendContactNotification(
      professionalEmail,
      data.clientName,
      data.clientEmail,
      data.subject,
      data.message
    );
    
    logInfo('Contact submission processed', {
      professionalId: data.professionalId,
      clientEmail: data.clientEmail,
      emailSent,
      requestId,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully',
      requestId,
    });
    
  } catch (error) {
    logError('Contact submission failed', { error: String(error), requestId });
    
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
