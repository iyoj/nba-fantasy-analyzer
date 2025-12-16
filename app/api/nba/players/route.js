import { NextResponse } from 'next/server';

const NBA_HEADERS = {
  'Host': 'stats.nba.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Origin': 'https://www.nba.com',
  'Referer': 'https://www.nba.com/',
  'Connection': 'keep-alive',
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  
  try {
    // Get all current season players from NBA.com
    const response = await fetch(
      'https://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&LeagueID=00&Season=2024-25',
      { headers: NBA_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`NBA API error: ${response.status}`);
    }
    
    const data = await response.json();
    const players = data.resultSets[0].rowSet;
    const headers = data.resultSets[0].headers;
    
    // Map indices
    const idIdx = headers.indexOf('PERSON_ID');
    const nameIdx = headers.indexOf('DISPLAY_FIRST_LAST');
    const teamIdIdx = headers.indexOf('TEAM_ID');
    const teamAbbrIdx = headers.indexOf('TEAM_ABBREVIATION');
    const teamCityIdx = headers.indexOf('TEAM_CITY');
    const teamNameIdx = headers.indexOf('TEAM_NAME');
    
    // Filter and format players
    const filtered = players
      .filter(p => p[nameIdx]?.toLowerCase().includes(search))
      .slice(0, 25)
      .map(p => ({
        id: p[idIdx],
        first_name: p[nameIdx]?.split(' ')[0] || '',
        last_name: p[nameIdx]?.split(' ').slice(1).join(' ') || '',
        position: '',
        team: {
          id: p[teamIdIdx],
          abbreviation: p[teamAbbrIdx] || 'FA',
          city: p[teamCityIdx] || '',
          name: p[teamNameIdx] || '',
        }
      }));
    
    return NextResponse.json({ data: filtered });
  } catch (error) {
    console.error('NBA API error:', error);
    return NextResponse.json({ error: 'Failed to fetch players', details: error.message }, { status: 500 });
  }
}
