'use client';

import React from 'react';
import { Tv, ExternalLink, CheckCircle2, ShieldCheck, Play, Radio, Sparkles } from 'lucide-react';

interface FreeLiveChannel {
  name: string;
  badge: string;
  coverage: string;
  platformUrl: string;
  isLegalFree: boolean;
  region: string;
  tag: string;
  description: string;
}

const FREE_PLATFORMS: FreeLiveChannel[] = [
  {
    name: 'GXR World',
    badge: '🇪🇸',
    coverage: 'La Liga EA Sports (Every Live Match Free)',
    platformUrl: 'https://www.gxr.world',
    isLegalFree: true,
    region: 'South Asia (India, Pakistan, Nepal, Bangladesh, Sri Lanka)',
    tag: '100% Free Official Partner',
    description: 'Official digital broadcasting partner streaming every La Liga match live in HD with zero subscription required.',
  },
  {
    name: 'ITVX & BBC iPlayer',
    badge: '🇬🇧',
    coverage: 'FA Cup, European Cups & Highlights',
    platformUrl: 'https://www.itv.com',
    isLegalFree: true,
    region: 'United Kingdom',
    tag: 'Free-To-Air Terrestrial',
    description: 'Legal free-to-air broadcast for live FA Cup matches, major England internationals, and weekly highlights.',
  },
  {
    name: 'Gol Play',
    badge: '⚽',
    coverage: 'La Liga (1 Free Match Every Week)',
    platformUrl: 'https://goltelevision.com',
    isLegalFree: true,
    region: 'Spain',
    tag: 'Free-To-Air TV & Web',
    description: 'Broadcasts one live La Liga EA Sports fixture for free every single gameweek.',
  },
  {
    name: 'ServusTV & ORF',
    badge: '⭐',
    coverage: 'UEFA Champions League & Europa League',
    platformUrl: 'https://www.servustv.com',
    isLegalFree: true,
    region: 'Austria / Europe',
    tag: 'Free Public Broadcaster',
    description: 'Public European broadcaster with official rights to select live Champions League games each matchday.',
  },
  {
    name: 'FIFA+ Official',
    badge: '🏆',
    coverage: 'Live Domestic Leagues, Tournaments & Club World Cup',
    platformUrl: 'https://www.plus.fifa.com',
    isLegalFree: true,
    region: 'Worldwide',
    tag: 'Official Free Portal',
    description: 'Streams over 40,000 live domestic and international matches each year directly on web and mobile.',
  },
  {
    name: 'Sky Sports Football (YouTube Live)',
    badge: '🔴',
    coverage: 'Live Matchday Watch-Alongs & Press Conferences',
    platformUrl: 'https://www.youtube.com/@SkySportsFootball',
    isLegalFree: true,
    region: 'Worldwide',
    tag: 'Official YouTube Live',
    description: 'Real-time live video watch-alongs with former pros, live reactions, minute-by-minute scoreboards, and tactical breakdowns.',
  },
];

export const FreeLiveChannels: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-stadium-900 to-stadium-850 border border-emerald-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-extrabold text-white">How To Actually Watch Live Matches For Free</h3>
          </div>
          <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
            Major leagues (EPL, UCL, La Liga) protect their live broadcast feeds with DRM encryption and paid paywalls. Below are the verified, 100% legal free-to-air platforms that legally stream live football for zero cost.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Free Services</span>
        </div>
      </div>

      {/* Grid of Free Live Streaming Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FREE_PLATFORMS.map((platform, idx) => (
          <div
            key={idx}
            className="bg-stadium-900 border border-gray-800 hover:border-emerald-500/50 rounded-xl p-5 flex flex-col justify-between shadow-lg hover:shadow-emerald-500/5 transition group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{platform.badge}</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{platform.tag}</span>
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1 group-hover:text-emerald-400 transition">
                {platform.name}
              </h4>
              <p className="text-xs font-semibold text-emerald-300 mb-2">{platform.coverage}</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{platform.description}</p>
            </div>

            <div className="pt-3 border-t border-gray-800/80 space-y-3">
              <div className="text-[10px] text-gray-500">
                <strong className="text-gray-400">Available In:</strong> {platform.region}
              </div>

              <a
                href={platform.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow transition"
              >
                <span>Open {platform.name} Stream</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
