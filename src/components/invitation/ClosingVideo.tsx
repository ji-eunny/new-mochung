'use client';

import { useEffect, useRef } from 'react';

/**
 * 마무리 영상. 모바일에서도 재생 버튼 없이 자동재생되도록 강제한다.
 *
 * 모바일 자동재생 정책:
 * - muted + playsInline 이어야 사용자 제스처 없이 재생 가능하다.
 * - iOS는 뷰포트 밖 영상의 자동재생을 미루므로 화면 진입 시 play()를 재시도한다.
 * - 저전력 모드 등으로 막히면 첫 사용자 상호작용(터치/클릭/스크롤) 때 한 번 더 시도한다.
 */
export default function ClosingVideo({ src, poster, alt, className }: { src: string; poster?: string; alt?: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // 자동재생 정책상 반드시 음소거 상태여야 한다.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');

    const tryPlay = () => {
      const promise = video.play();
      if (promise) promise.catch(() => { /* 자동재생 차단 시 무시(폴백에서 재시도) */ });
    };

    tryPlay();

    // 화면에 들어올 때 재생 시도(iOS는 뷰포트 밖 영상 자동재생을 미룬다).
    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => { for (const entry of entries) if (entry.isIntersecting) tryPlay(); },
        { threshold: 0.1 },
      );
      observer.observe(video);
    }

    // 저전력 모드 등으로 막힌 경우: 첫 사용자 상호작용에 한 번 재생 시도.
    const onGesture = () => tryPlay();
    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener('touchstart', onGesture, opts);
    window.addEventListener('click', onGesture, opts);
    window.addEventListener('scroll', onGesture, opts);

    return () => {
      observer?.disconnect();
      window.removeEventListener('touchstart', onGesture);
      window.removeEventListener('click', onGesture);
      window.removeEventListener('scroll', onGesture);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      aria-label={alt}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
    />
  );
}
