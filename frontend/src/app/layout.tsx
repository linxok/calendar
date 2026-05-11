import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Glow Studio — Запис до салону краси',
  description: 'Професійні beauty-послуги. Записуйтесь онлайн швидко та зручно. Манікюр, педикюр, зачіски, макіяж.',
  keywords: ['салон краси', 'запис онлайн', 'манікюр', 'зачіска', 'макіяж', 'beauty'],
  openGraph: {
    title: 'Glow Studio — Beauty Salon',
    description: 'Професійні beauty-послуги з онлайн-записом',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
