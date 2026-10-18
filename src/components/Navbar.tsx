'use client';

import React from 'react';
import { ShieldCheck, Tv, Radio, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCustomStream: () => void;
  liveMatchCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCustomStream,
  liveMatchCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stadium-900/95 backdrop-blur-md border-b border-gray-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('player')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 font-black text-xl tracking-tight">
              ⚽
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  KICKOFF<span className="text-emerald-400">LIVE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Ad-Free
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Premier League • UCL • La Liga Hub</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('player')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'player'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Live Player</span>
              {liveMatchCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                  {liveMatchCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                activeTab === 'matches'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Match Center</span>
            </button>

            <button
              onClick={() => setActiveTab('highlights')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'highlights'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Official Highlights
            </button>

            <button
              onClick={() => setActiveTab('standings')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'standings'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Standings
            </button>

            <button
              onClick={() => setActiveTab('broadcasters')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'broadcasters'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              Where to Watch
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Custom Stream Button */}
            <button
              onClick={onOpenCustomStream}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 hover:border-gray-600 transition-all shadow-sm"
              title="Add any custom .m3u8 or video feed"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Add Stream URL</span>
              <span className="sm:hidden">Stream</span>
            </button>

            {/* Ad-Free Verified Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Ads • Clean</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-800/60 text-xs">
          <button
            onClick={() => setActiveTab('player')}
            className={`py-1 px-2 rounded ${activeTab === 'player' ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}
          >
            Live Player
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`py-1 px-2 rounded ${activeTab === 'matches' ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}
          >
            Matches
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`py-1 px-2 rounded ${activeTab === 'highlights' ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}
          >
            Highlights
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`py-1 px-2 rounded ${activeTab === 'standings' ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}
          >
            Standings
          </button>
          <button
            onClick={() => setActiveTab('broadcasters')}
            className={`py-1 px-2 rounded ${activeTab === 'broadcasters' ? 'text-emerald-400 font-bold' : 'text-gray-400'}`}
          >
            Channels
          </button>
        </div>
      </div>
    </header>
  );
};
