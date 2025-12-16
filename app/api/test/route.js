import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BALLDONTLIE_API_KEY;
  
  let apiResult = {};
  
  try {
    const response = await fetch(
      'https://api.balldontlie.io/nba/v1/players?search=lebron',
      { headers: { 'Authorization': apiKey } }
    );
    
    apiResult = {
      status: response.status,
      statusText: response.statusText,
      body: await response.json()
    };
  } catch (error) {
    apiResult = {
      error: error.message
    };
  }
  
  return NextResponse.json({
    keyExists: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    apiResult
  });
}
