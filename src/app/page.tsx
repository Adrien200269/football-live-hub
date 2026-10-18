'use client';

import React, { useState, useMemo } from 'react';
import {
  Radio,
  Tv,
  Sparkles,
  Trophy,
  Globe,
  ShieldCheck,
  ChevronRight,
  Flame,
  Search,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Play
} from 'lucide-react';

import { Match, StreamSource, CompetitionId } from '../types/football';
import { COMPETITIONS, MOCK_MATCHES, MOCK_HIGHLIGHTS } from '../data/mockMatches';
import { Navbar } from '../components/Navbar';
import { LivePlayer } from '../components/LivePlayer';
import { MatchCard } from '../components/MatchCard';
import { MatchDetailModal } from '../components/MatchDetailModal';
import { HighlightsGrid } from '../components/HighlightsGrid';
import { StandingsTable } from '../components/StandingsTable';
import { BroadcasterGuide } from '../components/BroadcasterGuide';
import { StreamSourceModal } from '../components/StreamSourceModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('player');
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected match for streaming
  const [currentMatch, setCurrentMatch] = useState<Match>(MOCK_MATCHES[0]);
  const [activeSource, setActiveSource] = useState<StreamSource>(MOCK_MATCHES[0].streamSources[0]);

  // Modals & player view modes
  const [detailMatch, setDetailMatch] = useState<Match | null>(null);
  const [isCustomStreamOpen, setIsCustomStreamOpen] = useState<boolean>(false);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);

  // Live match count
  const liveCount = useMemo(() => {
    return MOCK_MATCHES.filter((m) => m.status === 'LIVE').length;
  }, []);

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return MOCK_MATCHES.filter((match) => {
      const matchesComp = selectedCompetition === 'all' || match.competition === selectedCompetition;
      const matchesSearch =
        searchQuery === '' ||
        match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.competitionName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesComp && matchesSearch;
    });
  }, [selectedCompetition, searchQuery]);

  // Handle select match to watch
  const handleSelectMatch = (match: Match) => {
    setCurrentMatch(match);
    if (match.streamSources.length > 0) {
      setActiveSource(match.streamSources[0]);
    }
    setActiveTab('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle playing custom stream
  const handleAddCustomStream = (source: StreamSource) => {
    setActiveSource(source);
    setActiveTab('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stadium-950 text-gray-100 flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCustomStream={() => setIsCustomStreamOpen(true)}
        liveMatchCount={liveCount}
      />

      {/* Live Scores Ticker Bar */}
      <section className="bg-stadium-900/90 border-b border-gray-800/80 overflow-x-auto py-2.5 px-4 scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center space-x-3 text-xs whitespace-nowrap">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>MATCHDAY TICKER</span>
          </div>

          <div className="flex items-center space-x-4">
            {MOCK_MATCHES.map((m) => {
              const isWatching = currentMatch.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectMatch(m)}
                  className={`cursor-pointer px-3 py-1 rounded-lg border transition flex items-center space-x-2.5 ${
                    isWatching
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-stadium-850 hover:bg-gray-800 border-gray-800 text-gray-300'
                  }`}
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{m.competition}</span>
                  <span className="font-semibold">{m.homeTeam.shortName}</span>
                  <span className="font-mono font-black text-white px-1.5 py-0.5 rounded bg-black/40">
                    {m.status === 'SCHEDULED' ? m.time : `${m.homeTeam.score} - ${m.awayTeam.score}`}
                  </span>
                  <span className="font-semibold">{m.awayTeam.shortName}</span>
                  {m.status === 'LIVE' && (
                    <span className="text-[10px] font-bold text-red-400 font-mono">{m.minute}&apos;</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-8">
        {/* PLAYER TAB CONTENT */}
        {activeTab === 'player' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Live Video Player */}
            <LivePlayer
              currentMatch={currentMatch}
              activeSource={activeSource}
              onSelectSource={setActiveSource}
              onOpenCustomStream={() => setIsCustomStreamOpen(true)}
              theaterMode={theaterMode}
              setTheaterMode={setTheaterMode}
            />

            {/* Quick Match Switcher Row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-base font-bold text-white">Other Premier Matches Today</h2>
                </div>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <span>View All Fixtures</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_MATCHES.filter((m) => m.id !== currentMatch.id).slice(0, 3).map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isActive={false}
                    onSelectMatch={handleSelectMatch}
                    onOpenDetails={setDetailMatch}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MATCHES / FIXTURES TAB */}
        {activeTab === 'matches' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Competition Filter Pills & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                {COMPETITIONS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setSelectedCompetition(comp.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
                      selectedCompetition === comp.id
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-stadium-900 text-gray-300 hover:text-white border border-gray-800'
                    }`}
                  >
                    <span>{comp.badge}</span>
                    <span>{comp.name}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search club or league..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stadium-900 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isActive={currentMatch.id === match.id}
                  onSelectMatch={handleSelectMatch}
                  onOpenDetails={setDetailMatch}
                />
              ))}
            </div>

            {filteredMatches.length === 0 && (
              <div className="text-center py-12 bg-stadium-900 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm">No matches found matching your filters.</p>
              </div>
            )}
          </div>
        )}

        {/* HIGHLIGHTS TAB */}
        {activeTab === 'highlights' && (
          <div className="animate-in fade-in duration-200">
            <HighlightsGrid
              highlights={MOCK_HIGHLIGHTS}
              onPlayHighlight={(src) => {
                setActiveSource(src);
                setActiveTab('player');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* STANDINGS TAB */}
        {activeTab === 'standings' && (
          <div className="animate-in fade-in duration-200">
            <StandingsTable />
          </div>
        )}

        {/* BROADCASTER GUIDE TAB */}
        {activeTab === 'broadcasters' && (
          <div className="animate-in fade-in duration-200">
            <BroadcasterGuide />
          </div>
        )}

        {/* Legal & Educational Architecture Explainer */}
        <section className="bg-gradient-to-r from-stadium-900 via-stadium-850 to-stadium-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">100% Ad-Free Architecture</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Unlike scam streaming sites that inject popunders, crypto-miners, and malicious redirect scripts, this app plays clean video manifests directly inside native HTML5 Video and Hls.js with zero third-party ads.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Universal HLS / M3U8 Player</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Integrated with Hls.js engine featuring adaptive bitrate switching, buffer resilience, picture-in-picture, theater view, and manual multi-resolution selection (1080p, 720p, 480p).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Free-To-Air & Rights Guide</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Direct links to legitimate free-to-air broadcast feeds worldwide (e.g. GXR World for La Liga, ITV/Gol Play for select European fixtures) and official rights holders.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stadium-900 border-t border-gray-800 py-6 px-4 text-center text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">KICKOFF<span className="text-emerald-400">LIVE</span></span>
            <span>• Universal Sports Streaming & Match Center</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-400">
            <span>Clean HLS Engine</span>
            <span>•</span>
            <span>Zero Tracking</span>
            <span>•</span>
            <span>No Popups</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MatchDetailModal
        match={detailMatch}
        onClose={() => setDetailMatch(null)}
        onWatchMatch={handleSelectMatch}
      />

      <StreamSourceModal
        isOpen={isCustomStreamOpen}
        onClose={() => setIsCustomStreamOpen(false)}
        onAddStream={handleAddCustomStream}
      />
    </div>
  );
}
