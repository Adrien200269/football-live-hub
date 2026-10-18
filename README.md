# ⚽ KickoffLive — Ad-Free Football Match & Live Stream Hub

[![Production](https://img.shields.io/badge/Vercel-Live%20Site-emerald?logo=vercel)](https://football-live-hub.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Adrien200269/football-live-hub)

🌐 **Live URL:** [https://football-live-hub.vercel.app](https://football-live-hub.vercel.app)

A full-stack Next.js 16 + React 19 web application built for watching football matches, checking real-time scores, exploring in-depth match lineups & commentary, viewing official highlights, and streaming live feeds with **zero ads, zero tracking, and zero malicious popups**.

---

## 🌟 Key Features

### 1. 🛡️ 100% Ad-Free Universal Live Stream Player
- **HLS / M3U8 Native Support:** Powered by `Hls.js` with automated fallback to native Apple Safari HLS.
- **Buffer & Quality Switcher:** Adaptive Bitrate (Auto, 1080p, 720p, 480p) with live latency indicators.
- **Controls & Modes:** Fullscreen, Picture-in-Picture (PiP), Theater Mode, and auto-hiding controls.
- **Custom Stream Loader:** Paste any authorized `.m3u8` stream manifest, IPTV link, or `.mp4` video URL to watch immediately.
- **Multi-Server Switching:** Seamlessly switch between primary, backup, or official highlight feeds with one click.

### 2. ⚡ Live Match Center
- **Premier Competitions:** English Premier League (EPL), UEFA Champions League (UCL), La Liga EA Sports, Serie A, and Bundesliga.
- **Real-Time Match Ticker:** Top banner showing live scores and minutes across simultaneous fixtures.
- **Match Detail Center:**
  - **Timeline:** Live events including goals (with scorers & assists), cards, and substitutions.
  - **Match Stats:** Interactive possession distribution, total shots, shots on target, corners, and fouls.
  - **Lineups:** Pitch formations (e.g. 4-3-3, 4-2-3-1) with starting XI and bench.

### 3. 🎬 Official Match Highlights & Replays
- Curated extended highlights, goal recaps, and post-match press conferences from verified channels (Sky Sports, TNT Sports, UEFA, and LaLiga EA Sports).
- Clean, sandboxed playback with no third-party popups or redirects.

### 4. 🏆 League Standings
- Live league tables with games played, wins, draws, losses, goal differences, points, and 5-game form guide.
- Visual qualification zone indicators for European competitions.

### 5. 📡 Official "Where to Watch" Broadcaster Directory
- Country-specific guide (UK, US, Canada, Spain, India, Australia) highlighting:
  - Official licensed networks (Sky, NBC/Peacock, TNT Sports, DAZN, Movistar).
  - Legal **Free-To-Air (FTA)** options (e.g., GXR World free streaming in South Asia, ITV & Gol Play terrestrial coverage).

---

## 🚀 Getting Started

### Development Server
To launch the application locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Architecture
```
c:\Users\User\Documents\Football/
├── src/
│   ├── app/
│   │   ├── globals.css         # Dark stadium theme & custom glow styles
│   │   ├── layout.tsx          # Root HTML & metadata configuration
│   │   └── page.tsx            # Main dashboard, tab switcher & ticker
│   ├── components/
│   │   ├── BroadcasterGuide.tsx # Legal broadcaster directory & FTA guide
│   │   ├── HighlightsGrid.tsx   # Official match recaps & YouTube embeds
│   │   ├── LivePlayer.tsx       # Core HLS.js video player with custom controls
│   │   ├── MatchCard.tsx        # Responsive fixture & live score card
│   │   ├── MatchDetailModal.tsx # Lineups, pitch formations & match stats
│   │   ├── Navbar.tsx           # Navigation bar with live counter & shortcuts
│   │   ├── StandingsTable.tsx   # League standings table with form indicators
│   │   └── StreamSourceModal.tsx# Dialog for pasting custom .m3u8 live feeds
│   ├── data/
│   │   └── mockMatches.ts      # Match data, test streams, and broadcasters
│   └── types/
│       └── football.ts         # TypeScript interfaces
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```
