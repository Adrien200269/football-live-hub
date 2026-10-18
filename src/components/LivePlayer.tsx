'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Radio,
  Server,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Layers,
  Settings,
  Activity,
  Tv
} from 'lucide-react';
import { Match, StreamSource } from '../types/football';
import { LivePitchTracker } from './LivePitchTracker';

interface LivePlayerProps {
  currentMatch: Match | null;
  activeSource: StreamSource | null;
  onSelectSource: (source: StreamSource) => void;
  onOpenCustomStream: () => void;
  theaterMode: boolean;
  setTheaterMode: (theater: boolean) => void;
}

export const LivePlayer: React.FC<LivePlayerProps> = ({
  currentMatch,
  activeSource,
  onSelectSource,
  onOpenCustomStream,
  theaterMode,
  setTheaterMode,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availableLevels, setAvailableLevels] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1); // -1 = Auto
  const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
  const [playerMode, setPlayerMode] = useState<'video' | 'pitch'>('video');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Setup stream playback whenever activeSource changes
  useEffect(() => {
    if (!activeSource) return;

    setPlayerError(null);
    setIsLoading(true);

    if (activeSource.type === 'youtube') {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = activeSource.url;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setIsLoading(false);
        const levels = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height,
          bitrate: lvl.bitrate,
        }));
        setAvailableLevels(levels);

        video.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay policy might require muted initially
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setPlayerError('Network connection issue. Trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setPlayerError('Media format error. Recovering media...');
              hls.recoverMediaError();
              break;
            default:
              setPlayerError('Stream unavailable. Try another server below.');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Apple HLS (Safari iOS/macOS)
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setPlayerError('Native playback failed. Try another server.');
        setIsLoading(false);
      });
    } else {
      setPlayerError('Your browser does not support HLS video playback.');
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeSource]);

  // Handle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Handle mute/volume
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      video.volume = volume || 0.8;
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    video.volume = val;
    setVolume(val);
    if (val === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  // Handle quality switch
  const handleQualitySelect = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentLevel(levelIndex);
      setShowQualityMenu(false);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Picture in Picture
  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch {
      // Ignored
    }
  };

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowQualityMenu(false);
      }
    }, 3500);
  };

  return (
    <div className={`w-full transition-all duration-300 ${theaterMode ? 'max-w-full px-0' : 'max-w-6xl mx-auto'}`}>
      {/* Player Frame Card */}
      <div className="bg-stadium-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Match Header Bar */}
        {currentMatch && (
          <div className="bg-stadium-850 px-4 sm:px-6 py-3 border-b border-gray-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentMatch.competitionName}
              </span>
              <div className="flex items-center space-x-2 text-sm font-bold text-white">
                <span className="flex items-center space-x-1.5">
                  <img src={currentMatch.homeTeam.logo} alt={currentMatch.homeTeam.name} className="w-5 h-5 object-contain" />
                  <span>{currentMatch.homeTeam.name}</span>
                </span>
                <span className="px-2 py-0.5 bg-gray-800 text-emerald-400 rounded font-mono font-black text-sm">
                  {currentMatch.homeTeam.score} - {currentMatch.awayTeam.score}
                </span>
                <span className="flex items-center space-x-1.5">
                  <img src={currentMatch.awayTeam.logo} alt={currentMatch.awayTeam.name} className="w-5 h-5 object-contain" />
                  <span>{currentMatch.awayTeam.name}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-900 p-0.5 rounded-lg border border-gray-800 text-[11px]">
                <button
                  onClick={() => setPlayerMode('video')}
                  className={`px-2.5 py-1 rounded font-semibold flex items-center space-x-1 transition ${
                    playerMode === 'video'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Tv className="w-3 h-3" />
                  <span>Live Stream</span>
                </button>
                <button
                  onClick={() => setPlayerMode('pitch')}
                  className={`px-2.5 py-1 rounded font-semibold flex items-center space-x-1 transition ${
                    playerMode === 'pitch'
                      ? 'bg-emerald-500 text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3 h-3" />
                  <span>2D Live Radar</span>
                </button>
              </div>

              {currentMatch.status === 'LIVE' ? (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>LIVE • {currentMatch.minute}&apos;</span>
                </div>
              ) : (
                <span className="text-gray-400 text-xs hidden sm:inline">{currentMatch.time}</span>
              )}
            </div>
          </div>
        )}

        {/* Conditional View: 2D Radar vs Video Canvas */}
        {playerMode === 'pitch' && currentMatch ? (
          <div className="p-4 bg-stadium-950">
            <LivePitchTracker match={currentMatch} />
          </div>
        ) : (
        /* Video Canvas Container */
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setShowControls(false)}
          className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group select-none"
        >
          {activeSource?.type === 'youtube' ? (
            <iframe
              src={activeSource.url}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
              />

              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10 pointer-events-none">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mb-3"></div>
                  <p className="text-xs font-semibold text-gray-300 tracking-wide">CONNECTING TO CLEAN STREAM FEED...</p>
                </div>
              )}

              {/* Error Overlay */}
              {playerError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-6 text-center">
                  <ShieldAlert className="w-12 h-12 text-amber-400 mb-3" />
                  <h3 className="text-base font-bold text-white mb-1">Stream Signal Notice</h3>
                  <p className="text-xs text-gray-300 max-w-md mb-4">{playerError}</p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => activeSource && onSelectSource(activeSource)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-2 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Feed</span>
                    </button>
                    <button
                      onClick={onOpenCustomStream}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-lg flex items-center space-x-2 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Input Custom M3U8</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Overlay Controls */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4 transition-opacity duration-300 z-10 ${
                  showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Top Controls Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                      <span>{activeSource?.title || 'Live Broadcast'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-[11px] font-medium text-emerald-300 border border-emerald-500/20 hidden sm:inline-flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Ad-Free Protected</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setTheaterMode(!theaterMode)}
                      className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-xs text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 transition"
                      title="Toggle Theater Mode"
                    >
                      {theaterMode ? 'Standard' : 'Theater'}
                    </button>
                  </div>
                </div>

                {/* Big Center Play/Pause button when paused */}
                {!isPlaying && !isLoading && !playerError && (
                  <div className="self-center">
                    <button
                      onClick={togglePlay}
                      className="w-16 h-16 rounded-full bg-emerald-500/90 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl hover:scale-105 transition transform"
                    >
                      <Play className="w-8 h-8 fill-black translate-x-0.5" />
                    </button>
                  </div>
                )}

                {/* Bottom Controls Bar */}
                <div className="flex items-center justify-between gap-3 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-gray-800">
                  {/* Left Controls: Play/Pause, Volume */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-emerald-400 transition"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <div className="flex items-center space-x-2 group/vol">
                      <button
                        onClick={toggleMute}
                        className="text-gray-300 hover:text-white transition"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span>LIVE</span>
                    </div>
                  </div>

                  {/* Right Controls: Quality, PiP, Fullscreen */}
                  <div className="flex items-center space-x-3 relative">
                    {/* Quality Selector */}
                    {availableLevels.length > 0 && (
                      <div className="relative">
                        <button
                          onClick={() => setShowQualityMenu(!showQualityMenu)}
                          className="flex items-center space-x-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition"
                        >
                          <Settings className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {currentLevel === -1
                              ? 'Auto'
                              : `${availableLevels[currentLevel]?.height || 'HD'}p`}
                          </span>
                        </button>

                        {showQualityMenu && (
                          <div className="absolute bottom-9 right-0 bg-stadium-900 border border-gray-700 rounded-lg shadow-xl p-1.5 text-xs min-w-[110px] z-30">
                            <button
                              onClick={() => handleQualitySelect(-1)}
                              className={`w-full text-left px-2.5 py-1.5 rounded transition ${
                                currentLevel === -1 ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              Auto (Adaptive)
                            </button>
                            {availableLevels.map((lvl) => (
                              <button
                                key={lvl.id}
                                onClick={() => handleQualitySelect(lvl.id)}
                                className={`w-full text-left px-2.5 py-1.5 rounded transition ${
                                  currentLevel === lvl.id
                                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                                    : 'text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                {lvl.height}p ({Math.round(lvl.bitrate / 1000)}k)
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* PiP Button */}
                    <button
                      onClick={togglePiP}
                      className="text-gray-300 hover:text-white transition hidden sm:block"
                      title="Picture in Picture"
                    >
                      <Layers className="w-4 h-4" />
                    </button>

                    {/* Fullscreen Button */}
                    <button
                      onClick={toggleFullscreen}
                      className="text-gray-300 hover:text-white transition"
                      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                      {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        )}

        {/* Stream Source Selector Toolbar */}
        <div className="bg-stadium-850 px-4 sm:px-6 py-3 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-gray-400 font-medium">Available Servers / Feeds:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {currentMatch?.streamSources.map((source, index) => {
                const isSelected = activeSource?.id === source.id;
                return (
                  <button
                    key={source.id}
                    onClick={() => onSelectSource(source)}
                    className={`px-3 py-1 rounded-md font-medium transition flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-black font-bold shadow-sm'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700'
                    }`}
                  >
                    <span>Server {index + 1} ({source.quality})</span>
                    {source.isOfficial && <span className="text-[10px] uppercase font-bold text-emerald-950">HQ</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-3 text-gray-400">
            <span className="hidden sm:inline">Have your own HLS/M3U8 link?</span>
            <button
              onClick={onOpenCustomStream}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 flex items-center space-x-1"
            >
              <span>Paste Custom Feed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
