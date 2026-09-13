import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SITE } from '@/lib/site';
import './globals.css';

const myeongjo = localFont({ src: '../../public/fonts/NanumMyeongjo-Regular.ttf', variable: '--font-myeongjo', display: 'swap', weight: '400' });
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#ffffff' };
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url), title: SITE.title, description: SITE.description,
  openGraph: { title: SITE.title, description: SITE.description, url: SITE.url, siteName: SITE.title, type: 'website', locale: 'ko_KR', images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.title }] },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description, images: [SITE.ogImage] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" className={myeongjo.variable}><body>{children}</body></html>;
}
