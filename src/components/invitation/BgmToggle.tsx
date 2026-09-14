'use client';

import { useRef, useState } from 'react';

/**
 * 배경음악 토글. 우상단 스피커 버튼으로 켜고/끈다.
 *
 * 유튜브는 mp4/mp3 파일 직접 재생 링크를 제공하지 않으므로, 숨긴 유튜브 임베드
 * 플레이어를 postMessage(enablejsapi)로 제어한다. 사용자의 버튼 클릭이 재생을
 * 트리거하므로 브라우저 자동재생(소리) 정책에도 걸리지 않는다.
 *
 * mp3 파일이 있으면 이 컴포넌트를 <audio>로 교체하는 편이 가볍다.
 */
const VIDEO_ID = 'ih_j2A6Pnms';

export default function BgmToggle() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  const send = (func: 'playVideo' | 'pauseVideo') => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args: [] }),
      '*',
    );
  };

  const toggle = () => {
    setPlaying(prev => {
      send(prev ? 'pauseVideo' : 'playVideo');
      return !prev;
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? '배경음악 끄기' : '배경음악 켜기'}
        aria-pressed={playing}
        className="fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full bg-white/70 text-neutral-700 shadow-sm backdrop-blur transition-colors hover:bg-white/90"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
            <path d="M16 8.5a4 4 0 0 1 0 7" />
            <path d="M18.6 6a7 7 0 0 1 0 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
            <line x1="16" y1="9.5" x2="21" y2="14.5" />
            <line x1="21" y1="9.5" x2="16" y2="14.5" />
          </svg>
        )}
      </button>

      {/* 숨긴 BGM 플레이어 (display:none이면 재생이 멈추므로 1px로 유지) */}
      <iframe
        ref={iframeRef}
        title="배경음악 플레이어"
        src={`https://www.youtube.com/embed/${VIDEO_ID}?enablejsapi=1&loop=1&playlist=${VIDEO_ID}&controls=0&playsinline=1&rel=0`}
        allow="autoplay; encrypted-media"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none fixed bottom-0 right-0 h-px w-px border-0 opacity-0"
      />
    </>
  );
}
