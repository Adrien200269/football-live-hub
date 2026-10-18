export type CompetitionId = 'all' | 'epl' | 'ucl' | 'laliga' | 'seriea' | 'bundesliga';

export interface Competition {
  id: CompetitionId;
  name: string;
  shortName: string;
  badge: string;
  country: string;
  color: string;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var';
  team: 'home' | 'away';
  player: string;
  detail?: string;
}

export interface MatchStats {
  possession: [number, number]; // [home, away]
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface StreamSource {
  id: string;
  title: string;
  url: string;
  type: 'hls' | 'mp4' | 'youtube';
  quality: string;
  serverName: string;
  isOfficial?: boolean;
}

export interface Match {
  id: string;
  competition: CompetitionId;
  competitionName: string;
  status: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  minute?: number;
  date: string;
  time: string;
  stadium: string;
  referee?: string;
  homeTeam: {
    name: string;
    shortName: string;
    logo: string;
    score: number;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo: string;
    score: number;
  };
  events?: MatchEvent[];
  stats?: MatchStats;
  streamSources: StreamSource[];
  lineups?: {
    home: { formation: string; starting: string[]; bench: string[] };
    away: { formation: string; starting: string[]; bench: string[] };
  };
}

export interface OfficialHighlight {
  id: string;
  title: string;
  competition: CompetitionId;
  thumbnail: string;
  youtubeId: string;
  duration: string;
  views: string;
  channel: string;
  date: string;
}

export interface StandingTeam {
  position: number;
  team: string;
  logo: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface BroadcasterInfo {
  country: string;
  countryCode: string;
  flag: string;
  competitions: {
    epl: { name: string; isFree: boolean; link: string };
    ucl: { name: string; isFree: boolean; link: string };
    laliga: { name: string; isFree: boolean; link: string };
  };
}
