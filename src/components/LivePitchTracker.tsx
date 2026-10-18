'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Activity, Target, Shield, Zap, Volume2, ExternalLink } from 'lucide-react';
import { Match } from '../types/football';

interface LivePitchTrackerProps {
  match: Match;
}

type PitchZone = 'home_defense' | 'home_midfield' | 'away_midfield' | 'away_attack' | 'goal_home' | 'goal_away';

export const LivePitchTracker: React.FC<LivePitchTrackerProps> = ({ match }) => {
  const [currentAction, setCurrentAction] = useState<string>('Midfield battle in progress');
  const [activeZone, setActiveZone] = useState<PitchZone>('home_midfield');
  const [attackIntensity, setAttackIntensity] = useState<'normal' | 'dangerous' | 'shot'>('normal');

  // Simulated live match momentum radar
  useEffect(() => {
    if (match.status !== 'LIVE') return;

    const actions = [
      { text: `${match.homeTeam.shortName} building up from the back`, zone: 'home_defense' as PitchZone, intensity: 'normal' as const },
      { text: `Quick passing through midfield by ${match.homeTeam.shortName}`, zone: 'home_midfield' as PitchZone, intensity: 'normal' as const },
      { text: `Dangerous cross into the box by ${match.homeTeam.name}!`, zone: 'away_attack' as PitchZone, intensity: 'dangerous' as const },
      { text: `Shot on target! Saved by goalkeeper!`, zone: 'goal_away' as PitchZone, intensity: 'shot' as const },
      { text: `${match.awayTeam.shortName} launching a fast counter-attack`, zone: 'away_midfield' as PitchZone, intensity: 'dangerous' as const },
      { text: `${match.awayTeam.name} looking for space in the final third`, zone: 'home_defense' as PitchZone, intensity: 'normal' as const },
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % actions.length;
      setCurrentAction(actions[index].text);
      setActiveZone(actions[index].zone);
      setAttackIntensity(actions[index].intensity);
    }, 4000);

    return () => clearInterval(interval);
  }, [match]);

  return (
    <div className="bg-stadium-900 border border-gray-800 rounded-xl overflow-hidden p-4 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between text-xs border-b border-gray-800 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-bold text-white uppercase tracking-wider">Live Match 2D Radar & Visualizer</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono font-bold text-[11px] border border-red-500/30 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span>{match.status === 'LIVE' ? `LIVE ${match.minute || 65}'` : match.status}</span>
          </span>
        </div>
      </div>

      {/* 2D Football Pitch Visualizer */}
      <div className="relative aspect-[21/9] bg-gradient-to-r from-emerald-950 via-green-950 to-emerald-950 rounded-lg border-2 border-emerald-600/40 overflow-hidden flex items-center justify-center p-3 select-none shadow-inner">
        {/* Pitch Field Lines */}
        <div className="absolute inset-2 border border-white/20 rounded pointer-events-none"></div>
        {/* Center Line */}
        <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 border-r border-white/20 pointer-events-none"></div>
        {/* Center Circle */}
        <div className="absolute w-20 h-20 rounded-full border border-white/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute w-2 h-2 rounded-full bg-white/40 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        {/* Home Penalty Box (Left) */}
        <div className="absolute left-2 top-1/4 bottom-1/4 w-16 border-r border-t border-b border-white/20 pointer-events-none"></div>
        {/* Away Penalty Box (Right) */}
        <div className="absolute right-2 top-1/4 bottom-1/4 w-16 border-l border-t border-b border-white/20 pointer-events-none"></div>

        {/* Team Badges on Pitch */}
        <div className="absolute left-4 top-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-700">
          <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-4 h-4 object-contain" />
          <span className="text-[11px] font-bold text-white">{match.homeTeam.shortName}</span>
        </div>

        <div className="absolute right-4 top-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-gray-700">
          <span className="text-[11px] font-bold text-white">{match.awayTeam.shortName}</span>
          <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-4 h-4 object-contain" />
        </div>

        {/* Animated Ball & Action Indicator */}
        <div className="z-10 flex flex-col items-center animate-bounce">
          <div className="w-5 h-5 rounded-full bg-white shadow-lg shadow-white/50 border border-gray-300 flex items-center justify-center text-[10px]">
            ⚽
          </div>
        </div>

        {/* Attack Intensity Banner */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-700 text-xs font-semibold text-white flex items-center space-x-2 shadow-lg">
          {attackIntensity === 'dangerous' ? (
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          ) : attackIntensity === 'shot' ? (
            <Target className="w-3.5 h-3.5 text-red-400 animate-ping" />
          ) : (
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className={attackIntensity === 'dangerous' ? 'text-amber-300 font-bold' : attackIntensity === 'shot' ? 'text-red-400 font-extrabold' : 'text-gray-200'}>
            {currentAction}
          </span>
        </div>
      </div>

      {/* Possession & Stats Bar */}
      {match.stats && (
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between font-semibold text-gray-300 text-[11px]">
            <span>{match.homeTeam.name} ({match.stats.possession[0]}%)</span>
            <span className="text-gray-500 uppercase font-mono">Ball Possession</span>
            <span>({match.stats.possession[1]}%) {match.awayTeam.name}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${match.stats.possession[0]}%` }}></div>
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${match.stats.possession[1]}%` }}></div>
          </div>
        </div>
      )}

      {/* Live Audio / Free Official Commentary Portal */}
      <div className="bg-stadium-850 p-3 rounded-lg border border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white">Free Official Live Match Radio Commentary</h4>
            <p className="text-[11px] text-gray-400">Live ball-by-ball audio broadcast via BBC Radio 5 Live & talkSPORT</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="https://talksport.com/football/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center space-x-1.5 transition border border-gray-700"
          >
            <span>talkSPORT Live</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </a>
          <a
            href="https://www.bbc.co.uk/sounds/play/live:bbc_radio_five_live"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow"
          >
            <span>BBC 5 Live</span>
            <ExternalLink className="w-3 h-3 text-white" />
          </a>
        </div>
      </div>
    </div>
  );
};
