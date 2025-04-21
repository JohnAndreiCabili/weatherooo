import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  
  return NextResponse.json({
    keyStatus: apiKey ? 'API key is present' : 'API key is missing',
    keyLength: apiKey ? apiKey.length : 0,
    // We mask most of the key for security but show part to verify it's the right one
    keyPreview: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'none',
  });
} 