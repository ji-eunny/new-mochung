'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { Photo } from '@/lib/invitation';

export default function GalleryLightbox({ photos, initialIndex, onClose }: { photos: Photo[]; initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const move = (direction: number) => setIndex(current => (current + direction + photos.length) % photos.length);

  useEffect(() => {
    const element = dialog.current;
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = overflow; focused?.focus({ preventScroll: true }); };
  }, []);

  return <dialog ref={dialog} className="lightbox" aria-label="웨딩 사진 크게 보기" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  }}>
    <button className="lightbox-close" onClick={onClose} aria-label="사진 닫기" autoFocus>×</button>
    <div className="lightbox-photo" onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => {
      if (!touchStart.current || event.changedTouches.length === 0) return;
      const dx = event.changedTouches[0].clientX - touchStart.current.x;
      const dy = event.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
      touchStart.current = null;
    }}><Image src={photos[index].src} alt={photos[index].alt} fill sizes="100vw" style={{ objectFit: 'contain' }} /></div>
    <div className="lightbox-controls"><button onClick={() => move(-1)} aria-label="이전 사진">←</button><p aria-live="polite">{index + 1} / {photos.length}</p><button onClick={() => move(1)} aria-label="다음 사진">→</button></div>
  </dialog>;
}
