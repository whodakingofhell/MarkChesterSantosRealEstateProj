import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { registerSchema } from '@/lib/validation';
import { prisma } from '@/lib/prisma';
import { logInfo, logError } from '@/lib/logger';
import { sendWelcomeEmail, sendVerificationEmail } from '@/lib/email';
import { registerLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rateLimited = await registerLimiter(request);
  if (rateLimited) return rateLimited;
  const requestId = crypto.randomUUID();
  
  try {
    const body = await request.json();
    
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input provided' },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }
    
    const passwordHash = await hash(data.password, 12);
    const verificationToken = crypto.randomUUID();
    
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
        role: data.role,
        emailVerificationToken: verificationToken,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://philippine-skyland.vercel.app';
    await sendVerificationEmail(user.email, user.name, verificationToken, appUrl);
    await sendWelcomeEmail(user.email, user.name, user.role);
    
    logInfo('User registered successfully', { userId: user.id, role: user.role });
    
    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
    });
    
  } catch (error) {
    logError('Registration failed', { error: String(error) });
    
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
