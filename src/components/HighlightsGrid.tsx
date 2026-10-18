'use client';

import React from 'react';
import { Play, Eye, Calendar, Sparkles } from 'lucide-react';
import { OfficialHighlight, StreamSource } from '../types/football';

interface HighlightsGridProps {
  highlights: OfficialHighlight[];
  onPlayHighlight: (source: StreamSource) => void;
}

export const HighlightsGrid: React.FC<HighlightsGridProps> = ({
  highlights,
  onPlayHighlight,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Official Match Highlights & Replays</span>
          </h2>
          <p className="text-xs text-gray-400">
            Ad-free embeds from verified official broadcasters (Sky Sports, TNT Sports, LaLiga EA Sports)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              onPlayHighlight({
                id: item.id,
                title: item.title,
                url: `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`,
                type: 'youtube',
                quality: 'Official 4K/HD',
                serverName: item.channel,
                isOfficial: true,
              });
            }}
            className="group cursor-pointer bg-stadium-900 border border-gray-800 hover:border-emerald-500/50 rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-gray-900">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/90 group-hover:bg-emerald-400 text-black flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[10px] font-bold text-white">
                {item.duration}
              </span>
            </div>

            {/* Content */}
            <div className="p-3.5 flex flex-col justify-between flex-1">
              <h3 className="text-xs font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition mb-2">
                {item.title}
              </h3>

              <div className="text-[11px] text-gray-400 space-y-1">
                <p className="font-semibold text-gray-300 truncate">{item.channel}</p>
                <div className="flex items-center space-x-3 text-gray-500 text-[10px]">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.views}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
