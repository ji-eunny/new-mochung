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
            __html: `(function(){if('scrollRestoration'in history)history.scrollRestoration='manual';window.scrollTo(0,0);var locked='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';var open='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover';var fixed='';function apply(c){var nodes=document.querySelectorAll('meta[name="viewport"]');for(var i=nodes.length-1;i>=0;i--)nodes[i].remove();var meta=document.createElement('meta');meta.name='viewport';meta.content=c;document.head.appendChild(meta);}function recover(){var scale=window.visualViewport?window.visualViewport.scale:1;if(scale<=1.02){if(fixed){fixed='';document.documentElement.style.zoom='';}return;}var correction=String(1/scale);if(fixed===correction)return;apply(open);void document.documentElement.offsetWidth;apply(locked);var next=window.visualViewport?window.visualViewport.scale:1;if(next<=1.02){fixed='';document.documentElement.style.zoom='';return;}fixed=String(1/next);document.documentElement.style.zoom=fixed;}apply(locked);recover();window.addEventListener('pageshow',recover);if(window.visualViewport)window.visualViewport.addEventListener('resize',recover);})();`,
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
