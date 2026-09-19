import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { SITE } from '@/lib/site';
import DisableZoom from '@/components/invitation/DisableZoom';
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
  metadataBase: new URL(SITE.url), title: SITE.title, description: SITE.description,
  openGraph: { title: SITE.title, description: SITE.description, url: SITE.url, siteName: SITE.title, type: 'website', locale: 'ko_KR', images: [{ url: SITE.ogImage, width: 1600, height: 1067, alt: SITE.title }] },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description, images: [SITE.ogImage] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={myeongjo.variable}>
      <head>
        {/* 일부 인앱/구형 브라우저용 확대 방지 메타 (Next viewport와 병행) */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        {/* JS 미실행 시 등장 애니메이션 초기 상태(숨김)에서 콘텐츠가 그대로 보이도록 */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <DisableZoom />
        {children}
      </body>
    </html>
  );
}
