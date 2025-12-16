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
  const playerId = searchParams.get('player_id');
  
  if (!playerId) {
    return NextResponse.json({ error: 'Player ID required' }, { status: 400 });
  }
  
  try {
    // Get player stats from NBA.com
    const response = await fetch(
      `https://stats.nba.com/stats/playerdashboardbygeneralsplits?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=${playerId}&PlusMinus=N&Rank=N&Season=2024-25&SeasonSegment=&SeasonType=Regular%20Season&ShotClockRange=&Split=general&VsConference=&VsDivision=`,
      { headers: NBA_HEADERS }
    );
    
    if (!response.ok) {
      throw new Error(`NBA API error: ${response.status}`);
    }
    
    const data = await response.json();
    const statsSet = data.resultSets.find(rs => rs.name === 'OverallPlayerDashboard');
    
    if (!statsSet || statsSet.rowSet.length === 0) {
      return NextResponse.json({ data: [] });
    }
    
    const headers = statsSet.headers;
    const stats = statsSet.rowSet[0];
    
    // Map the stats
    const getVal = (name) => {
      const idx = headers.indexOf(name);
      return idx >= 0 ? stats[idx] : 0;
    };
    
    const playerStats = {
      pts: getVal('PTS'),
      reb: getVal('REB'),
      ast: getVal('AST'),
      stl: getVal('STL'),
      blk: getVal('BLK'),
      fg3m: getVal('FG3M'),
      fg_pct: getVal('FG_PCT'),
      ft_pct: getVal('FT_PCT'),
      turnover: getVal('TOV'),
      games_played: getVal('GP'),
    };
    
    return NextResponse.json({ data: [playerStats] });
  } catch (error) {
    console.error('NBA Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats', details: error.message }, { status: 500 });
  }
}
