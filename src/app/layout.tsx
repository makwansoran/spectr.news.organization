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
  title: 'Spectr | News, Politics, Finance & Economy',
  description: 'Global news, analysis, and data. Politics, finance, economy, and companies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${publicSans.variable} ${cormorant.variable}`}>
      <body className="min-h-screen flex flex-col bg-globalist-white font-sans text-globalist-black">
        {children}
      </body>
    </html>
  );
}
