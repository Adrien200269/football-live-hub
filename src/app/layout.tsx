import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KickoffLive • Ad-Free Football Match & Stream Hub (EPL, UCL, La Liga)',
  description: 'Stream live football matches, check real-time scores, watch official highlights, and explore broadcaster guides without ads.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-stadium-950 text-gray-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
