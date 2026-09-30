'use client';

import { useEffect, useRef, useState } from 'react';

import { assetPath } from '@/lib/asset';

import Section from './Section';
import Reveal from './Reveal';

const SRC = assetPath('/images/wedding.mov');
const POSTER = assetPath('/images/wedding-poster.jpg');

/**
 * INFORMATION ↔ WEDDING DAY.
 * 타이틀 없이 영상만, 재생 버튼으로 재생.
 */
export default function WeddingVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            setPlaying(false);
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const toggle = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!video.paused) {
      video.pause();
      return;
    }

    try {
      // 모바일 브라우저에서 재생 가능하도록 명시
      video.muted = true;
      video.playsInline = true;

      await video.play();
    } catch (error) {
      console.error('영상 재생 실패:', error);
      setPlaying(false);
    }
  };

  return (
    <Section
      aria-label="웨딩 영상"
      className="min-h-0 justify-center gap-0 px-0 pb-10 pt-10"
    >
      <Reveal className="w-full">
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={SRC}
            poster={POSTER}
            aria-label="재훈과 지은의 웨딩 영상"
            muted
            playsInline
            preload="metadata"
            controls={false}
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />

          <button
            type="button"
            data-allow-tap="true"
            onClick={toggle}
            aria-label={playing ? '영상 일시정지' : '영상 재생'}
            className={
              playing
                ? 'absolute inset-0 z-20 touch-manipulation bg-transparent'
                : 'absolute inset-0 z-20 grid place-items-center touch-manipulation bg-black/20'
            }
          >
            {!playing && (
              <span className="grid h-14 w-14 place-items-center rounded-full bg-white/85 text-neutral-800 shadow-sm backdrop-blur-sm">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M8 5.5v13l11-6.5L8 5.5z"
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
      </Reveal>
    </Section>
  );
}