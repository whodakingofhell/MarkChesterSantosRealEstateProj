import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/logger';
import { apiLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;

  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    const property = await prisma.property.findUnique({
      where: { id },
      include: { broker: { select: { userId: true } } },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const isOwner = property.broker.userId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Only the property owner or admin can upload images' }, { status: 403 });
    }

    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    if (images.length > 20) {
      return NextResponse.json({ error: 'Maximum 20 images allowed' }, { status: 400 });
    }

    for (const img of images) {
      if (typeof img !== 'string') {
        return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
      }
    }

    const updated = await prisma.property.update({
      where: { id },
      data: { images: JSON.stringify(images) },
      include: { broker: { include: { user: { select: { id: true, name: true, email: true, role: true } } } } },
    });

    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    logError('Failed to update property images', { error: String(error) });
    return NextResponse.json({ error: 'Failed to update property images' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const rateLimited = await apiLimiter(request);
  if (rateLimited) return rateLimited;

  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    const userId = (session.user as any).id;

    const property = await prisma.property.findUnique({
      where: { id },
      include: { broker: { select: { userId: true } } },
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const isOwner = property.broker.userId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Only the property owner or admin can delete images' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '-1');

    if (index < 0) {
      return NextResponse.json({ error: 'Invalid image index' }, { status: 400 });
    }

    const currentImages = JSON.parse(property.images || '[]');
    if (index >= currentImages.length) {
      return NextResponse.json({ error: 'Image index out of range' }, { status: 400 });
    }

    currentImages.splice(index, 1);

    const updated = await prisma.property.update({
      where: { id },
      data: { images: JSON.stringify(currentImages) },
    });

    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    logError('Failed to delete property image', { error: String(error) });
    return NextResponse.json({ error: 'Failed to delete property image' }, { status: 500 });
  }
}
