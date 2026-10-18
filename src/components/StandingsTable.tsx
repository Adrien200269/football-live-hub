'use client';

import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { MOCK_STANDINGS } from '../data/mockMatches';

export const StandingsTable: React.FC = () => {
  const [activeLeague, setActiveLeague] = useState<'epl' | 'laliga' | 'ucl'>('epl');
  const teams = MOCK_STANDINGS[activeLeague];

  const leagueNames = {
    epl: 'Premier League Table',
    laliga: 'La Liga EA Sports Table',
    ucl: 'UEFA Champions League Stage',
  };

  return (
    <div className="bg-stadium-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
      {/* Table Header and League Switcher */}
      <div className="p-4 sm:p-5 bg-stadium-850 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">{leagueNames[activeLeague]}</h2>
        </div>

        <div className="flex items-center bg-gray-900 p-1 rounded-lg border border-gray-800 text-xs">
          <button
            onClick={() => setActiveLeague('epl')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeLeague === 'epl' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            EPL
          </button>
          <button
            onClick={() => setActiveLeague('laliga')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeLeague === 'laliga' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            La Liga
          </button>
          <button
            onClick={() => setActiveLeague('ucl')}
            className={`px-3 py-1.5 rounded-md font-semibold transition ${
              activeLeague === 'ucl' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            UCL
          </button>
        </div>
      </div>

      {/* Standings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stadium-950/80 text-gray-400 uppercase text-[11px] font-semibold border-b border-gray-800">
            <tr>
              <th className="py-3 px-4 w-12 text-center">Pos</th>
              <th className="py-3 px-4">Club</th>
              <th className="py-3 px-3 text-center">MP</th>
              <th className="py-3 px-3 text-center">W</th>
              <th className="py-3 px-3 text-center">D</th>
              <th className="py-3 px-3 text-center">L</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell">GD</th>
              <th className="py-3 px-4 text-center font-bold text-white">Pts</th>
              <th className="py-3 px-4 text-center hidden md:table-cell">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 font-medium">
            {teams.map((row) => (
              <tr key={row.team} className="hover:bg-gray-800/30 transition-colors">
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono font-bold text-xs ${
                      row.position <= 4
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'text-gray-400'
                    }`}
                  >
                    {row.position}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <img src={row.logo} alt={row.team} className="w-6 h-6 object-contain" />
                    <span className="font-bold text-white text-xs sm:text-sm">{row.team}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-gray-300 font-mono">{row.played}</td>
                <td className="py-3 px-3 text-center text-gray-300 font-mono">{row.won}</td>
                <td className="py-3 px-3 text-center text-gray-300 font-mono">{row.draw}</td>
                <td className="py-3 px-3 text-center text-gray-300 font-mono">{row.lost}</td>
                <td className="py-3 px-3 text-center text-gray-400 font-mono hidden sm:table-cell">
                  {row.gd > 0 ? `+${row.gd}` : row.gd}
                </td>
                <td className="py-3 px-4 text-center font-black font-mono text-emerald-400 text-sm">
                  {row.points}
                </td>
                <td className="py-3 px-4 text-center hidden md:table-cell">
                  <div className="flex items-center justify-center space-x-1">
                    {row.form.map((res, i) => (
                      <span
                        key={i}
                        className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center font-mono ${
                          res === 'W'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : res === 'D'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-stadium-950/60 border-t border-gray-800 text-[11px] text-gray-500 flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Positions 1-4: UEFA Champions League Group Stage Qualification</span>
        </div>
      </div>
    </div>
  );
};
