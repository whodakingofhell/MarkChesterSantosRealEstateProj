import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { apiLimiter } from '@/lib/rate-limit';
import { transactionSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    
    const where: any = {};
    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;
    
    if (userRole === 'BROKER') where.broker = { userId };
    else if (userRole === 'CLIENT') where.client = { userId };
    if (status) where.status = status;
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          property: true,
          broker: { include: { user: { select: { id: true, email: true, name: true, role: true } } } },
          client: { include: { user: { select: { id: true, email: true, name: true, role: true } } } },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: transactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
    
  } catch (error) {
    logError('Failed to fetch transactions', { error: String(error) });
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userRole = (session.user as any).role;
    if (userRole !== 'BROKER' && userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const body = await request.json();
    
    const validation = transactionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input provided' },
        { status: 400 }
      );
    }
    
    const validatedData = validation.data;
    
    const brokerProfile = await prisma.brokerProfile.findUnique({
      where: { userId: (session.user as any).id },
    });
    
    if (!brokerProfile) {
      return NextResponse.json({ error: 'Broker profile not found' }, { status: 404 });
    }
    
    const commission = validatedData.amount * (validatedData.commissionRate / 100);
    
    const transaction = await prisma.transaction.create({
      data: {
        propertyId: validatedData.propertyId,
        brokerId: brokerProfile.id,
        clientId: validatedData.clientId,
        type: validatedData.type,
        amount: validatedData.amount,
        commission,
        commissionRate: validatedData.commissionRate,
        notes: validatedData.notes,
      },
      include: {
        property: true,
        broker: { include: { user: { select: { id: true, email: true, name: true, role: true } } } },
        client: { include: { user: { select: { id: true, email: true, name: true, role: true } } } },
      },
    });
    
    return NextResponse.json({ success: true, data: transaction });
    
  } catch (error) {
    logError('Failed to create transaction', { error: String(error) });
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
