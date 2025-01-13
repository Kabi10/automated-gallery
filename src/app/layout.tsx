import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Automated Gallery',
  description: 'A modern gallery website with AI-powered features',
  keywords: ['gallery', 'images', 'AI', 'Next.js', 'React'],
  authors: [{ name: 'Kabi10' }],
  openGraph: {
    title: 'Automated Gallery',
    description: 'A modern gallery website with AI-powered features',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
} 