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
  const count = photos.length;
  const canNavigate = count > 1;
  const [index, setIndex] = useState(initialIndex);
  const [displayIndex, setDisplayIndex] = useState(initialIndex);
  /** 0이면 가운데 장. 1이면 다음 장으로, -1이면 이전 장으로 한 칸 이동 중. */
  const [shift, setShift] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const shiftRef = useRef(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    dx: number;
  } | null>(null);

  const settle = () => {
    const direction = shiftRef.current;
    if (direction === 0) return;
    shiftRef.current = 0;
    setAnimate(false);
    setShift(0);
    setIndex(current => (current + direction + count) % count);
  };

  const move = (direction: 1 | -1) => {
    if (!canNavigate || shiftRef.current !== 0) return;
    shiftRef.current = direction;
    setDragging(false);
    setDragX(0);
    setAnimate(true);
    setShift(direction);
    setDisplayIndex(current => (current + direction + count) % count);
  };

  const releaseDrag = (pointerId: number) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== pointerId) return;
    dragRef.current = null;
    setDragging(false);

    const width = viewportRef.current?.clientWidth ?? window.innerWidth;
    const threshold = Math.min(72, width * 0.16);
    const direction: 1 | -1 | 0 = drag.dx <= -threshold ? 1 : drag.dx >= threshold ? -1 : 0;

    setAnimate(true);
    requestAnimationFrame(() => {
      setDragX(0);
      if (direction === 0) return;
      shiftRef.current = direction;
      setShift(direction);
      setDisplayIndex(current => (current + direction + count) % count);
    });
  };

  const settleRef = useRef(settle);
  settleRef.current = settle;

  useEffect(() => {
    if (shift === 0) return;
    const timer = window.setTimeout(() => settleRef.current(), 340);
    return () => window.clearTimeout(timer);
  }, [shift]);

  const slides = canNavigate
    ? [
        { key: 'prev', photo: photos[(index - 1 + count) % count] },
        { key: 'current', photo: photos[index] },
        { key: 'next', photo: photos[(index + 1) % count] },
      ]
    : [{ key: 'single', photo: photos[index] }];

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
        if (!canNavigate) return;
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
        ref={viewportRef}
        className={
          canNavigate
            ? `absolute inset-x-0 top-[max(56px,env(safe-area-inset-top))] bottom-[max(84px,env(safe-area-inset-bottom))] overflow-hidden touch-none select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`
            : 'absolute inset-x-0 top-[max(56px,env(safe-area-inset-top))] bottom-[max(24px,env(safe-area-inset-bottom))] overflow-hidden'
        }
        onPointerDown={event => {
          if (!canNavigate || shiftRef.current !== 0 || event.button !== 0) return;
          dragRef.current = { pointerId: event.pointerId, startX: event.clientX, dx: 0 };
          setDragging(true);
          setAnimate(false);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event => {
          const drag = dragRef.current;
          if (!drag || drag.pointerId !== event.pointerId) return;
          const width = viewportRef.current?.clientWidth ?? window.innerWidth;
          const dx = Math.max(-width, Math.min(width, event.clientX - drag.startX));
          drag.dx = dx;
          setDragX(dx);
        }}
        onPointerUp={event => releaseDrag(event.pointerId)}
        onPointerCancel={event => releaseDrag(event.pointerId)}
      >
        {/* 이전·현재·다음 세 장만 두고 한 칸씩 이동. 끄는 동안에는 손가락을 따라간다. */}
        <div
          className={`flex h-full w-full will-change-transform ${animate ? 'transition-transform duration-300 ease-out' : ''}`}
          style={{ transform: canNavigate ? `translateX(calc(-${(1 + shift) * 100}% + ${dragX}px))` : 'translateX(0)' }}
          onTransitionEnd={event => {
            if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
            settle();
          }}
        >
          {slides.map(({ key, photo }) => (
            <div key={count > 2 ? photo.src : key} className="relative h-full w-full shrink-0 grow-0 basis-full">
              <Image
                src={assetPath(photo.src)}
                alt={photo.alt}
                fill
                sizes="100vw"
                draggable={false}
                className="pointer-events-none object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {canNavigate && (
        <div className="absolute inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] flex items-center justify-center gap-7 font-sans text-sm text-neutral-500">
          <button
            className="h-12 w-12 text-2xl"
            onClick={() => move(-1)}
            aria-label="이전 사진"
          >
            ←
          </button>
          <p aria-live="polite">{displayIndex + 1} / {photos.length}</p>
          <button
            className="h-12 w-12 text-2xl"
            onClick={() => move(1)}
            aria-label="다음 사진"
          >
            →
          </button>
        </div>
      )}
    </dialog>
  );
}
