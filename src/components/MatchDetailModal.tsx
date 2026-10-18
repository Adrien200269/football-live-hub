'use client';

import React, { useState } from 'react';
import { X, Play, Clock, BarChart2, Users } from 'lucide-react';
import { Match } from '../types/football';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  onWatchMatch: (match: Match) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  onWatchMatch,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'stats' | 'lineups'>('timeline');

  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-stadium-900 border border-gray-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stadium-850 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {match.competitionName}
            </span>
            <span className="text-xs text-gray-400">• {match.stadium}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scoreboard Banner */}
        <div className="p-6 bg-gradient-to-b from-stadium-850 to-stadium-900 border-b border-gray-800 text-center">
          <div className="flex items-center justify-around max-w-lg mx-auto">
            {/* Home */}
            <div className="flex flex-col items-center flex-1">
              <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-14 h-14 object-contain mb-2" />
              <h4 className="text-sm font-bold text-white">{match.homeTeam.name}</h4>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center px-4">
              {match.status === 'SCHEDULED' ? (
                <div className="font-mono text-xl font-bold text-emerald-400">{match.time}</div>
              ) : (
                <div className="flex items-center space-x-3 font-mono font-black text-4xl text-white">
                  <span>{match.homeTeam.score}</span>
                  <span className="text-gray-600">:</span>
                  <span>{match.awayTeam.score}</span>
                </div>
              )}
              <span className="text-xs font-semibold uppercase mt-1 tracking-wider text-red-400">
                {match.status === 'LIVE' ? `LIVE • ${match.minute}'` : match.status}
              </span>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center flex-1">
              <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-14 h-14 object-contain mb-2" />
              <h4 className="text-sm font-bold text-white">{match.awayTeam.name}</h4>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                onWatchMatch(match);
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition transform hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Watch in Live Player</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-800 bg-stadium-950/60 text-xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'timeline'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-gray-800/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'stats'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-gray-800/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Match Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('lineups')}
            className={`flex-1 py-3 font-semibold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'lineups'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-gray-800/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Lineups</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              {match.events && match.events.length > 0 ? (
                match.events.map((event, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center space-x-3 p-3 rounded-xl border ${
                      event.team === 'home'
                        ? 'bg-gray-800/30 border-gray-700/60'
                        : 'bg-gray-800/50 border-gray-700/80'
                    }`}
                  >
                    <span className="w-9 h-9 rounded-full bg-gray-800 font-mono font-bold text-xs flex items-center justify-center text-emerald-400 border border-gray-700">
                      {event.minute}&apos;
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {event.type === 'goal' && <span>⚽</span>}
                        {event.type === 'yellow_card' && <span className="w-3 h-4 bg-yellow-400 rounded-sm inline-block"></span>}
                        {event.type === 'red_card' && <span className="w-3 h-4 bg-red-600 rounded-sm inline-block"></span>}
                        <span className="text-sm font-bold text-white">{event.player}</span>
                        <span className="text-[10px] uppercase font-bold text-gray-400 px-1.5 py-0.5 bg-gray-800 rounded">
                          {event.team === 'home' ? match.homeTeam.shortName : match.awayTeam.shortName}
                        </span>
                      </div>
                      {event.detail && <p className="text-xs text-gray-400 mt-0.5">{event.detail}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-xs">
                  Match timeline and key events will appear once kickoff commences.
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              {match.stats ? (
                <>
                  {/* Possession */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                      <span>{match.stats.possession[0]}%</span>
                      <span>Possession</span>
                      <span>{match.stats.possession[1]}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 h-full" style={{ width: `${match.stats.possession[0]}%` }}></div>
                      <div className="bg-blue-500 h-full" style={{ width: `${match.stats.possession[1]}%` }}></div>
                    </div>
                  </div>

                  {/* Shots */}
                  <div className="pt-2 border-t border-gray-800/80">
                    <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                      <span>{match.stats.shots[0]}</span>
                      <span>Total Shots</span>
                      <span>{match.stats.shots[1]}</span>
                    </div>
                  </div>

                  {/* Shots on Target */}
                  <div className="pt-2 border-t border-gray-800/80">
                    <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                      <span>{match.stats.shotsOnTarget[0]}</span>
                      <span>Shots on Target</span>
                      <span>{match.stats.shotsOnTarget[1]}</span>
                    </div>
                  </div>

                  {/* Corners */}
                  <div className="pt-2 border-t border-gray-800/80">
                    <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                      <span>{match.stats.corners[0]}</span>
                      <span>Corners</span>
                      <span>{match.stats.corners[1]}</span>
                    </div>
                  </div>

                  {/* Fouls */}
                  <div className="pt-2 border-t border-gray-800/80">
                    <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
                      <span>{match.stats.fouls[0]}</span>
                      <span>Fouls</span>
                      <span>{match.stats.fouls[1]}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500 text-xs">
                  Detailed match metrics will be recorded in real-time during the match.
                </div>
              )}
            </div>
          )}

          {activeTab === 'lineups' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {match.lineups ? (
                <>
                  {/* Home Lineup */}
                  <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/60">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-white text-sm">{match.homeTeam.name}</span>
                      <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        {match.lineups.home.formation}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase">Starting XI</p>
                    <ul className="text-xs text-gray-300 space-y-1.5">
                      {match.lineups.home.starting.map((p, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-5 text-gray-500 font-mono text-[10px]">{i + 1}</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Away Lineup */}
                  <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/60">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-white text-sm">{match.awayTeam.name}</span>
                      <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                        {match.lineups.away.formation}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-gray-400 mb-2 uppercase">Starting XI</p>
                    <ul className="text-xs text-gray-300 space-y-1.5">
                      {match.lineups.away.starting.map((p, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <span className="w-5 text-gray-500 font-mono text-[10px]">{i + 1}</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500 text-xs">
                  Official team sheets are revealed 60 minutes before kickoff.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
