import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('player_id');
  const season = searchParams.get('season') || '2024';
  const apiKey = process.env.BALLDONTLIE_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }
  
  if (!playerId) {
    return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
  }
  
  try {
    const response = await fetch(
      `https://api.balldontlie.io/nba/v1/season_averages?season=${season}&player_ids[]=${playerId}`,
      { headers: { 'Authorization': apiKey } }
    );
    
    if (!response.ok) {
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
