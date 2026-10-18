'use client';

import React from 'react';
import { Play, BarChart3, Radio } from 'lucide-react';
import { Match } from '../types/football';

interface MatchCardProps {
  match: Match;
  isActive: boolean;
  onSelectMatch: (match: Match) => void;
  onOpenDetails: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  isActive,
  onSelectMatch,
  onOpenDetails,
}) => {
  const isLive = match.status === 'LIVE';
  const isFinished = match.status === 'FINISHED';

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isActive
          ? 'bg-stadium-850 border-emerald-500/70 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
          : 'bg-stadium-900 border-gray-800 hover:border-gray-700 hover:bg-stadium-850'
      }`}
    >
      {/* Top Competition Bar */}
      <div className="px-4 py-2 bg-black/30 border-b border-gray-800/80 flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-300 flex items-center space-x-1.5">
          <span>{match.competitionName}</span>
        </span>

        {isLive ? (
          <div className="flex items-center space-x-1 text-red-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>LIVE {match.minute}&apos;</span>
          </div>
        ) : isFinished ? (
          <span className="text-gray-400 font-semibold bg-gray-800 px-2 py-0.5 rounded text-[11px]">
            FULL TIME
          </span>
        ) : (
          <span className="text-emerald-400 font-medium">{match.time}</span>
        )}
      </div>

      {/* Main Scoreboard Section */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        {/* Home Team */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-12 h-12 mb-2 relative flex items-center justify-center p-1 bg-gray-800/40 rounded-full border border-gray-700/50">
            <img
              src={match.homeTeam.logo}
              alt={match.homeTeam.name}
              className="w-9 h-9 object-contain drop-shadow"
            />
          </div>
          <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">
            {match.homeTeam.name}
          </span>
          <span className="text-[11px] text-gray-400 font-mono sm:hidden">
            {match.homeTeam.shortName}
          </span>
        </div>

        {/* Score & Time */}
        <div className="px-3 sm:px-6 flex flex-col items-center justify-center">
          {match.status === 'SCHEDULED' ? (
            <div className="text-center">
              <span className="text-xs font-semibold text-gray-400 block">{match.date}</span>
              <span className="text-base font-extrabold text-white font-mono">{match.time}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                {match.homeTeam.score}
              </span>
              <span className="text-gray-500 font-bold">-</span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                {match.awayTeam.score}
              </span>
            </div>
          )}
          <span className="text-[10px] text-gray-500 mt-1 line-clamp-1 max-w-[120px] text-center">
            {match.stadium.split(',')[0]}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-12 h-12 mb-2 relative flex items-center justify-center p-1 bg-gray-800/40 rounded-full border border-gray-700/50">
            <img
              src={match.awayTeam.logo}
              alt={match.awayTeam.name}
              className="w-9 h-9 object-contain drop-shadow"
            />
          </div>
          <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">
            {match.awayTeam.name}
          </span>
          <span className="text-[11px] text-gray-400 font-mono sm:hidden">
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-stadium-950/60 border-t border-gray-800/80 flex items-center gap-2">
        <button
          onClick={() => onSelectMatch(match)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            isActive
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'bg-emerald-600/90 hover:bg-emerald-500 text-white'
          }`}
        >
          {isLive ? (
            <>
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{isActive ? 'Watching Now' : 'Watch Live Stream'}</span>
            </>
          ) : isFinished ? (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isActive ? 'Playing Replay' : 'Watch Replay / Highlights'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Preview Stream</span>
            </>
          )}
        </button>

        <button
          onClick={() => onOpenDetails(match)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition"
          title="View Match Stats & Lineups"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
