import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ChatWidget from '@/components/ChatWidget';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AureumTech - Premium PC Hardware & Custom Builds',
  description:
    'Buy high-performance mechanical keyboards, lightweight gaming mice, curved monitors, and elite custom PCs. Interactive compatibility builder and real-time market prices.',
  keywords: 'PC Builder, computer hardware, mechanical keyboards, gaming mice, monitors, Uzbekistan PC shop, OLX integration',
  authors: [{ name: 'AureumTech Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-black text-brand-cream pb-20 md:pb-0">
        <AppProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
            {children}
          </main>
          <CartDrawer />
          <ChatWidget />
        </AppProvider>
      </body>
    </html>
  );
}
