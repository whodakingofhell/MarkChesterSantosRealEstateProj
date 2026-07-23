import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logSecurityEvent } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminRole = (session.user as any).role;
    if (adminRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can terminate accounts' }, { status: 403 });
    }

    const { userId, reason } = await request.json();

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (userId === (session.user as any).id) {
      return NextResponse.json({ error: 'Cannot terminate your own account' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role === 'ADMIN') {
      return NextResponse.json({ error: 'Cannot terminate other admin accounts' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    await prisma.session.deleteMany({ where: { userId } });

    logSecurityEvent('ACCOUNT_TERMINATED', {
      adminId: (session.user as any).id,
      adminEmail: (session.user as any).email,
      targetUserId: userId,
      targetEmail: targetUser.email,
      targetName: targetUser.name,
      reason: reason || 'No reason provided',
    });

    return NextResponse.json({
      success: true,
      message: `Account for ${targetUser.name} (${targetUser.email}) has been terminated.`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to terminate account' }, { status: 500 });
  }
}
