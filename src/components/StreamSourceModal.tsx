'use client';

import React, { useState } from 'react';
import { X, Play, Plus, Link as LinkIcon, Radio, Check } from 'lucide-react';
import { StreamSource } from '../types/football';

interface StreamSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStream: (source: StreamSource) => void;
}

const PRESET_TEST_STREAMS = [
  {
    title: 'Premier League Match Highlights (Arsenal vs Man City)',
    url: 'https://www.youtube.com/embed/VM71aSciS2w?autoplay=1',
    type: 'youtube' as const,
    quality: '1080p Official',
    serverName: 'Premier League HD',
  },
  {
    title: 'El Clásico Epic Action (Real Madrid vs Barcelona)',
    url: 'https://www.youtube.com/embed/irzxnoX6xvo?autoplay=1',
    type: 'youtube' as const,
    quality: '4K Official',
    serverName: 'La Liga EA Sports HD',
  },
  {
    title: 'UEFA Champions League Action (Bayern vs Real Madrid)',
    url: 'https://www.youtube.com/embed/vrHkyEwQsbY?autoplay=1',
    type: 'youtube' as const,
    quality: '1080p Official',
    serverName: 'UCL Official Broadcast',
  },
];

export const StreamSourceModal: React.FC<StreamSourceModalProps> = ({
  isOpen,
  onClose,
  onAddStream,
}) => {
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [streamQuality, setStreamQuality] = useState('1080p');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamUrl.trim()) {
      setError('Please provide a valid stream URL.');
      return;
    }

    const isHls = streamUrl.includes('.m3u8');
    const isYoutube = streamUrl.includes('youtube.com') || streamUrl.includes('youtu.be');

    let formattedUrl = streamUrl.trim();
    let type: 'hls' | 'mp4' | 'youtube' = isHls ? 'hls' : 'mp4';

    if (isYoutube) {
      type = 'youtube';
      // convert youtube watch link to embed if needed
      if (formattedUrl.includes('watch?v=')) {
        const videoId = formattedUrl.split('watch?v=')[1]?.split('&')[0];
        formattedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      } else if (formattedUrl.includes('youtu.be/')) {
        const videoId = formattedUrl.split('youtu.be/')[1]?.split('?')[0];
        formattedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }

    const newSource: StreamSource = {
      id: `custom-${Date.now()}`,
      title: streamTitle.trim() || 'Custom Feed',
      url: formattedUrl,
      type,
      quality: streamQuality,
      serverName: 'Custom Source',
    };

    onAddStream(newSource);
    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESET_TEST_STREAMS[0]) => {
    onAddStream({
      id: `preset-${Date.now()}`,
      title: preset.title,
      url: preset.url,
      type: preset.type,
      quality: preset.quality,
      serverName: preset.serverName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-stadium-900 border border-gray-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stadium-850 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Add Custom Live Stream</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          <p className="text-xs text-gray-300 leading-relaxed">
            Connect any legitimate HLS stream (<code className="text-emerald-400">.m3u8</code>), MP4 video, or authorized live feed into this player. It will stream directly with <strong className="text-white">zero ads, zero tracking, and zero popups</strong>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Stream / Manifest URL (.m3u8 or video link)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="https://example.com/live/stream.m3u8"
                  value={streamUrl}
                  onChange={(e) => {
                    setStreamUrl(e.target.value);
                    setError(null);
                  }}
                  className="w-full bg-gray-950 border border-gray-700 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition pl-9"
                />
                <LinkIcon className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Feed Title</label>
                <input
                  type="text"
                  placeholder="e.g. My Match Stream"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Quality Label</label>
                <select
                  value={streamQuality}
                  onChange={(e) => setStreamQuality(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition"
                >
                  <option value="1080p 60fps">1080p 60fps</option>
                  <option value="720p HD">720p HD</option>
                  <option value="4K UHD">4K UHD</option>
                  <option value="Auto">Auto Adaptive</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg transition"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Load & Stream Feed</span>
            </button>
          </form>

          {/* Quick presets */}
          <div className="pt-4 border-t border-gray-800">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Or Try One-Click Public Test Feeds:
            </span>
            <div className="space-y-2">
              {PRESET_TEST_STREAMS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="w-full text-left p-2.5 rounded-lg bg-gray-800/40 hover:bg-gray-800 border border-gray-700/60 hover:border-emerald-500/40 flex items-center justify-between text-xs transition"
                >
                  <div>
                    <span className="font-semibold text-white block">{preset.title}</span>
                    <span className="text-[10px] text-gray-400">{preset.quality} • {preset.serverName}</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Test Play
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
