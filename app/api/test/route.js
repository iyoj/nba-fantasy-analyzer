import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BALLDONTLIE_API_KEY;
  
  return NextResponse.json({
    keyExists: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0
  });
}
