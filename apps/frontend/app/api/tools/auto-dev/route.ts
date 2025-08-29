import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Auto.dev provider has been archived. Use /api/tools/listings instead.' },
    { status: 410 }
  );
}

