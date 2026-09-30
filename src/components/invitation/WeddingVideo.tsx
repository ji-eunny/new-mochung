'use client';

import { useEffect, useRef, useState } from 'react';
import { assetPath } from '@/lib/asset';
import Section from './Section';
import Reveal from './Reveal';

const SRC = assetPath('/images/wedding.mp4');
const POSTER = assetPath('/images/wedding-poster.jpg');

export default function WeddingVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [debug, setDebug] = useState('대기 중');

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
            setPlaying(false);
            setDebug('화면에서 벗어나 영상 정지');
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
      setDebug('❌ video 요소를 찾지 못함');
      return;
    }

    setDebug('① 버튼 터치됨');

    try {
      if (!video.paused) {
        video.pause();
        setPlaying(false);
        setDebug('② 영상 일시정지');
        return;
      }

      setDebug('② 재생 시도 중...');

      video.muted = true;
      video.playsInline = true;

      await video.play();

      setPlaying(true);
      setDebug('③ ✅ 재생 성공');
    } catch (error) {
      console.error(error);

      setPlaying(false);

      setDebug(
        `❌ 재생 실패: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
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
            onLoadedMetadata={() => {
              setDebug('영상 파일 로드 완료');
            }}
            onCanPlay={() => {
              setDebug('영상 재생 가능');
            }}
            onPlay={() => {
              setPlaying(true);
              setDebug('▶️ 영상 재생 이벤트 발생');
            }}
            onPause={() => {
              setPlaying(false);
            }}
            onEnded={() => {
              setPlaying(false);
              setDebug('영상 재생 완료');
            }}
            onError={() => {
              const error = videoRef.current?.error;

              setDebug(
                `❌ 영상 파일 오류: ${
                  error
                    ? `code ${error.code}`
                    : '알 수 없는 오류'
                }`,
              );
            }}
          />

          <button
            type="button"
            data-allow-tap="true"
            aria-label={playing ? '영상 일시정지' : '영상 재생'}
            onPointerUp={event => {
              event.preventDefault();
              event.stopPropagation();

              toggle();
            }}
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
                  className="ml-0.5"
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