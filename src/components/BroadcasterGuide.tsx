'use client';

import React, { useState } from 'react';
import { Globe, ExternalLink, Info, CheckCircle2 } from 'lucide-react';
import { BROADCASTERS } from '../data/mockMatches';

export const BroadcasterGuide: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('United Kingdom');
  const activeCountry = BROADCASTERS.find((b) => b.country === selectedCountry) || BROADCASTERS[0];

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-stadium-900 border border-blue-500/30 rounded-xl p-4 sm:p-5 flex items-start space-x-3.5">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h3 className="font-bold text-white text-sm">Official & Legal Broadcast Directory</h3>
          <p className="text-gray-300 leading-relaxed">
            Major football rights (EPL, UCL, La Liga) are distributed across licensed television and digital platforms. Below is the authorized broadcaster guide by country, including legal <strong className="text-emerald-400">Free-To-Air (FTA)</strong> options that allow viewing without expensive subscriptions.
          </p>
        </div>
      </div>

      {/* Country Selection Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {BROADCASTERS.map((b) => (
          <button
            key={b.country}
            onClick={() => setSelectedCountry(b.country)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              selectedCountry === b.country
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-stadium-900 text-gray-300 hover:text-white border border-gray-800 hover:border-gray-700'
            }`}
          >
            <span>{b.flag}</span>
            <span>{b.country}</span>
          </button>
        ))}
      </div>

      {/* Rights Grid for Selected Country */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* EPL */}
        <div className="bg-stadium-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                Premier League (EPL)
              </span>
              {activeCountry.competitions.epl.isFree ? (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Free-to-Air Options</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                  Official Rights Holder
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              {activeCountry.competitions.epl.name}
            </h4>
            <p className="text-xs text-gray-400">
              Live broadcast in HD & 4K UHD with studio analysis and live commentary.
            </p>
          </div>

          <a
            href={activeCountry.competitions.epl.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-gray-700"
          >
            <span>Visit Broadcaster</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </div>

        {/* UCL */}
        <div className="bg-stadium-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
                UEFA Champions League (UCL)
              </span>
              {activeCountry.competitions.ucl.isFree ? (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Free Matches</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                  Official Rights Holder
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              {activeCountry.competitions.ucl.name}
            </h4>
            <p className="text-xs text-gray-400">
              Complete group and knockout stages, including final European cup coverage.
            </p>
          </div>

          <a
            href={activeCountry.competitions.ucl.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-gray-700"
          >
            <span>Visit Broadcaster</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </div>

        {/* La Liga */}
        <div className="bg-stadium-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-500/30">
                La Liga EA Sports
              </span>
              {activeCountry.competitions.laliga.isFree ? (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Free Online / TV</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                  Official Rights Holder
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mb-1">
              {activeCountry.competitions.laliga.name}
            </h4>
            <p className="text-xs text-gray-400">
              Every match of Real Madrid, Barcelona, Atletico Madrid, and all Spanish fixtures.
            </p>
          </div>

          <a
            href={activeCountry.competitions.laliga.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition border border-gray-700"
          >
            <span>Visit Broadcaster</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
