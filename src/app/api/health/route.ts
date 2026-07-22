import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Health check endpoint - minimal info, no env vars
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
