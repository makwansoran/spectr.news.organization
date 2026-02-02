import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';
import { Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-logo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'spectr | News, Politics, Finance & Economy',
  description: 'Global news, analysis, and data. Politics, finance, economy, and companies.',
  other: {
    'google-adsense-account': 'ca-pub-8659207565346557',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${publicSans.variable} ${cormorant.variable}`}>
      <head>
        {/* AdSense verification: meta tag + script in head so Google crawler can verify */}
        <meta name="google-adsense-account" content="ca-pub-8659207565346557" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8659207565346557"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-screen flex flex-col bg-globalist-white font-sans text-globalist-black">
        {children}
      </body>
    </html>
  );
}
