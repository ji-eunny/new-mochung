import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SITE } from '@/lib/site';
import DisableZoom from '@/components/invitation/DisableZoom';
import ScrollToTop from '@/components/invitation/ScrollToTop';
import './globals.css';

const myeongjo = localFont({ src: '../../public/fonts/NanumMyeongjo-Regular.ttf', variable: '--font-myeongjo', display: 'swap', weight: '400' });
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.title,
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={myeongjo.variable}>
      <head>
        {/* 페인트 전에 스크롤 복원 차단 → 새로고침 시 맨 위 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration'in history)history.scrollRestoration='manual';window.scrollTo(0,0);`,
          }}
        />
        {/* JS 미실행 시 등장 애니메이션 초기 상태(숨김)에서 콘텐츠가 그대로 보이도록 */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <DisableZoom />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
