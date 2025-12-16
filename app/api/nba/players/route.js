import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const apiKey = process.env.BALLDONTLIE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }
  
  try {
    const response = await fetch(
      `https://api.balldontlie.io/nba/v1/players?search=${encodeURIComponent(search || '')}`,
      { headers: { 'Authorization': apiKey } }
    );
    
    if (!response.ok) {
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 });
  }
}
