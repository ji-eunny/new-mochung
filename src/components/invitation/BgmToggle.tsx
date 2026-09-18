'use client';

import { useRef, useState } from 'react';
import { assetPath } from '@/lib/asset';

/** 배경음악 토글. 우상단 스피커로 public m4a를 재생/일시정지. */
const BGM_SRC = assetPath('/our-story-begins.m4a');

export default function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      audio.loop = true;
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
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

      <audio
        ref={audioRef}
        src={BGM_SRC}
        preload="metadata"
        playsInline
        loop
        aria-hidden="true"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </>
  );
}
