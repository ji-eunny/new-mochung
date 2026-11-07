'use client';

import { useEffect, useRef, useState } from 'react';
import { assetPath } from '@/lib/asset';

/** 배경음악 토글. 기본은 재생. 스크롤·화면 터치로 켜지 않고, 버튼으로만 끄고 켠다. */
const BGM_SRC = assetPath('/our-story-begins.m4a');

export default function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    const tryPlay = () => {
      if (pausedByUser.current) return;
      const promise = audio.play();
      if (!promise) return;
      promise.catch(() => {
        // 브라우저가 소리 자동재생을 막으면 스피커 버튼으로만 켠다.
        setPlaying(false);
      });
    };

    tryPlay();
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      pausedByUser.current = true;
      audio.pause();
      setPlaying(false);
      return;
    }

    pausedByUser.current = false;

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
        className="fixed right-3.5 top-[max(12px,env(safe-area-inset-top))] z-50 grid h-9 w-9 place-items-center rounded-full bg-white/50 text-neutral-600 ring-1 ring-black/5 backdrop-blur-md transition active:scale-95 active:bg-white/70"
      >
        {playing ? (
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 10v4h3.2L12 18.2V5.8L7.2 10H4z" />
            <path d="M15.5 9.2a3.2 3.2 0 0 1 0 5.6" />
            <path d="M17.6 7a6 6 0 0 1 0 10" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 10v4h3.2L12 18.2V5.8L7.2 10H4z" />
            <path d="M16.2 10.2l4.2 4.2" />
            <path d="M20.4 10.2l-4.2 4.2" />
          </svg>
        )}
      </button>

      <audio
        ref={audioRef}
        src={BGM_SRC}
        preload="auto"
        autoPlay
        playsInline
        loop
        aria-hidden="true"
        onEnded={() => setPlaying(false)}
        onPause={() => {
          if (pausedByUser.current || audioRef.current?.paused) setPlaying(false);
        }}
        onPlay={() => setPlaying(true)}
      />
    </>
  );
}
