'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Play,
  RefreshCw,
  Clock
} from 'lucide-react';

import { Match, StreamSource, CompetitionId, StandingTeam } from '../types/football';
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

  // Matches state: starts with mock, immediately loads live matches from API
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [isMatchesLoading, setIsMatchesLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Standings state: starts with empty, loads live from API
  const [liveStandings, setLiveStandings] = useState<Record<string, StandingTeam[]> | undefined>(undefined);
  const [isStandingsLoading, setIsStandingsLoading] = useState<boolean>(false);

  // Selected match for streaming
  const [currentMatch, setCurrentMatch] = useState<Match>(MOCK_MATCHES[0]);
  const [activeSource, setActiveSource] = useState<StreamSource>(MOCK_MATCHES[0].streamSources[0]);

  // Modals & player view modes
  const [detailMatch, setDetailMatch] = useState<Match | null>(null);
  const [isCustomStreamOpen, setIsCustomStreamOpen] = useState<boolean>(false);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);

  // Fetch live matches
  const fetchMatches = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsMatchesLoading(true);
    try {
      const res = await fetch('/api/matches');
      if (res.ok) {
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          setMatches(data.matches);

          // If current match was default mock, switch to the first live or upcoming match
          setCurrentMatch((prev) => {
            const exists = data.matches.find((m: Match) => m.id === prev.id);
            if (exists) return exists;
            // Pick live match first, else first match
            const liveMatch = data.matches.find((m: Match) => m.status === 'LIVE');
            const chosen = liveMatch || data.matches[0];
            if (chosen && chosen.streamSources?.length > 0) {
              setActiveSource(chosen.streamSources[0]);
            }
            return chosen;
          });

          setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      }
    } catch {
      // Fallback to existing matches
    } finally {
      setIsMatchesLoading(false);
    }
  }, []);

  // Fetch live standings
  const fetchStandings = useCallback(async () => {
    setIsStandingsLoading(true);
    try {
      const res = await fetch('/api/standings');
      if (res.ok) {
        const data = await res.json();
        if (data.standings) {
          setLiveStandings(data.standings);
        }
      }
    } catch {
      // Ignored
    } finally {
      setIsStandingsLoading(false);
    }
  }, []);

  // Initial load and periodic background sync every 45s
  useEffect(() => {
    fetchMatches();
    fetchStandings();

    const interval = setInterval(() => {
      fetchMatches(true);
    }, 45000);

    return () => clearInterval(interval);
  }, [fetchMatches, fetchStandings]);

  // Live match count
  const liveCount = useMemo(() => {
    return matches.filter((m) => m.status === 'LIVE').length;
  }, [matches]);

  // Filtered matches
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesComp = selectedCompetition === 'all' || match.competition === selectedCompetition;
      const matchesSearch =
        searchQuery === '' ||
        match.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.competitionName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesComp && matchesSearch;
    });
  }, [matches, selectedCompetition, searchQuery]);

  // Handle select match to watch
  const handleSelectMatch = (match: Match) => {
    setCurrentMatch(match);
    if (match.streamSources && match.streamSources.length > 0) {
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

      {/* Live Scores Ticker Bar with Live Sync status */}
      <section className="bg-stadium-900/95 border-b border-gray-800/80 overflow-x-auto py-2 px-4 scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3 overflow-x-auto scrollbar-none whitespace-nowrap">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>LIVE TICKER</span>
            </div>

            <div className="flex items-center space-x-3">
              {matches.slice(0, 8).map((m) => {
                const isWatching = currentMatch.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMatch(m)}
                    className={`cursor-pointer px-3 py-1 rounded-lg border transition flex items-center space-x-2 ${
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
                      <span className="text-[10px] font-bold text-red-400 font-mono animate-pulse">
                        {m.minute ? `${m.minute}'` : 'LIVE'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sync status & Refresh button */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] text-gray-400 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Live Data Sync: {lastRefreshed}</span>
            <button
              onClick={() => fetchMatches()}
              disabled={isMatchesLoading}
              className="p-1 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition"
              title="Refresh Live Matches"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isMatchesLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
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
                  <h2 className="text-base font-bold text-white">Live & Upcoming Matches Today</h2>
                </div>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <span>View All {matches.length} Matches</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.filter((m) => m.id !== currentMatch.id).slice(0, 6).map((match) => (
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

              {/* Search Bar & Refresh */}
              <div className="flex items-center space-x-2">
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

                <button
                  onClick={() => fetchMatches()}
                  disabled={isMatchesLoading}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg border border-gray-700 text-xs font-semibold flex items-center space-x-1.5 transition"
                  title="Reload Live Matches"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isMatchesLoading ? 'animate-spin text-emerald-400' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
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
                <p className="text-gray-400 text-sm">No matches found for the selected filter.</p>
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
            <StandingsTable
              liveStandings={liveStandings}
              isLoading={isStandingsLoading}
              onRefresh={fetchStandings}
            />
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
                  Unlike unofficial streaming websites that inject popunders, crypto-miners, and malicious redirects, this app streams manifests directly via native HTML5 Video and Hls.js with zero third-party ads.
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
                <h3 className="text-sm font-bold text-white mb-1">Live Scores & Free-To-Air Guide</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Real-time match data synced every 45 seconds, plus verified direct links to legitimate free-to-air broadcast feeds worldwide (e.g. GXR World for La Liga, ITV/Gol Play for European fixtures).
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
            <span>Real-Time Sync</span>
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
