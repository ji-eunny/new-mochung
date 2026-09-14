'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { assetPath } from '@/lib/asset';
import type { Photo } from '@/lib/invitation';

type LightboxProps = {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
};

/** 사진을 팝업(dialog)으로 크게 띄우고 좌우로 넘겨 보는 슬라이드 뷰어. */
export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  // 양 끝에서 멈춘다(순환 없음).
  const move = (direction: number) => setIndex(current => Math.min(Math.max(current + direction, 0), photos.length - 1));

  useEffect(() => {
    const element = dialog.current;
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    // 열릴 때 X(닫기) 버튼에 포커스 테두리가 생기지 않도록 dialog 자체에 포커스를 준다.
    element?.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; focused?.focus({ preventScroll: true }); };
  }, []);

  return (
    <dialog
      ref={dialog}
      tabIndex={-1}
      aria-label="사진 크게 보기"
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none border-0 bg-white p-0 text-neutral-900 outline-none focus:outline-none focus-visible:outline-none [&::backdrop]:bg-white"
      onCancel={onClose}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      }}
    >
      <button
        className="absolute right-3 top-[max(10px,env(safe-area-inset-top))] z-10 h-12 w-12 font-sans text-4xl leading-none text-neutral-500 outline-none focus:outline-none focus-visible:outline-none"
        onClick={onClose}
        aria-label="닫기"
      >
        ×
      </button>

      <div
        className="absolute inset-x-0 top-[max(56px,env(safe-area-inset-top))] bottom-[max(84px,env(safe-area-inset-bottom))] overflow-hidden [touch-action:pan-y_pinch-zoom]"
        onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchEnd={event => {
          if (!touchStart.current || event.changedTouches.length === 0) return;
          const dx = event.changedTouches[0].clientX - touchStart.current.x;
          const dy = event.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        {/* 모든 슬라이드를 가로로 이어붙인 트랙을 translateX로 이동 → 부드러운 슬라이드 */}
        <div
          className="flex h-full w-full transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {photos.map((photo, i) => (
            <div key={photo.src} className="relative h-full w-full shrink-0 grow-0 basis-full">
              <Image
                src={assetPath(photo.src)}
                alt={photo.alt}
                fill
                sizes="100vw"
                loading={Math.abs(i - index) <= 1 ? 'eager' : 'lazy'}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] flex items-center justify-center gap-7 font-sans text-sm text-neutral-500">
        <button
          className="h-12 w-12 text-2xl transition-opacity disabled:opacity-30"
          onClick={() => move(-1)}
          disabled={index === 0}
          aria-label="이전 사진"
        >
          ←
        </button>
        <p aria-live="polite">{index + 1} / {photos.length}</p>
        <button
          className="h-12 w-12 text-2xl transition-opacity disabled:opacity-30"
          onClick={() => move(1)}
          disabled={index === photos.length - 1}
          aria-label="다음 사진"
        >
          →
        </button>
      </div>
    </dialog>
  );
}
