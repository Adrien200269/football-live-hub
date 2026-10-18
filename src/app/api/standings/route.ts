import { NextResponse } from 'next/server';
import { StandingTeam } from '@/types/football';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes cache

const LEAGUES = {
  epl: 'eng.1',
  laliga: 'esp.1',
  ucl: 'uefa.champions',
};

function getStatVal(stats: any[], name: string): number {
  const stat = stats.find((s) => s.name === name);
  return stat ? Number(stat.value) : 0;
}

export async function GET() {
  try {
    const standingsData: Record<string, StandingTeam[]> = {
      epl: [],
      laliga: [],
      ucl: [],
    };

    await Promise.all(
      Object.entries(LEAGUES).map(async ([key, espnCode]) => {
        try {
          const res = await fetch(`https://site.api.espn.com/apis/v2/sports/soccer/${espnCode}/standings`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            next: { revalidate: 300 },
          });

          if (!res.ok) return;
          const json = await res.json();
          const entries = json.children?.[0]?.standings?.entries || [];

          const table: StandingTeam[] = entries.slice(0, 10).map((entry: any, index: number) => {
            const stats = entry.stats || [];
            const played = getStatVal(stats, 'gamesPlayed');
            const won = getStatVal(stats, 'wins');
            const draw = getStatVal(stats, 'ties');
            const lost = getStatVal(stats, 'losses');
            const gf = getStatVal(stats, 'pointsFor');
            const ga = getStatVal(stats, 'pointsAgainst');
            const gd = getStatVal(stats, 'pointDifferential');
            const points = getStatVal(stats, 'points');

            // Generate sample form based on win/draw/loss ratio
            const formSample: ('W' | 'D' | 'L')[] = won > lost ? ['W', 'W', 'D', 'W', 'W'] : ['D', 'L', 'W', 'D', 'L'];

            return {
              position: index + 1,
              team: entry.team?.displayName || 'Club',
              logo: entry.team?.logos?.[0]?.href || 'https://a.espncdn.com/i/teamlogos/soccer/500/default-team-logo.png',
              played,
              won,
              draw,
              lost,
              gf,
              ga,
              gd,
              points,
              form: formSample,
            };
          });

          standingsData[key] = table;
        } catch {
          // Keep empty if league fetch fails
        }
      })
    );

    return NextResponse.json({
      success: true,
      standings: standingsData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
