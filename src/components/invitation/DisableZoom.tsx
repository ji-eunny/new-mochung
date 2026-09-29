'use client';

import { useEffect } from 'react';

const VIEWPORT_LOCKED =
  'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

/** 확대가 걸린 경우 viewport meta를 잠깐 풀어 스케일을 1로 되돌린다. */
function resetViewportScale() {
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, minimum-scale=0.1, maximum-scale=1, user-scalable=yes, viewport-fit=cover',
    );
    // 다음 프레임에 다시 잠가 실제 배율을 1로 맞춤 (iOS/Chrome 공통 트릭)
    requestAnimationFrame(() => {
      meta.setAttribute('content', VIEWPORT_LOCKED);
      requestAnimationFrame(() => {
        meta.setAttribute('content', VIEWPORT_LOCKED);
      });
    });
  }

  const html = document.documentElement;
  const body = document.body;
  html.style.setProperty('zoom', '1');
  body.style.setProperty('zoom', '1');
  html.scrollLeft = 0;
  body.scrollLeft = 0;
}

function isZoomed() {
  const scale = window.visualViewport?.scale ?? 1;
  return Math.abs(scale - 1) > 0.01;
}

/** 모바일 핀치/더블탭, PC Ctrl·Cmd 휠·단축키 확대를 막고, 확대가 걸리면 즉시 1배로 복구한다. */
export default function DisableZoom() {
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    meta?.setAttribute('content', VIEWPORT_LOCKED);

    const prevent = (event: Event) => event.preventDefault();

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      if (
        ['+', '-', '=', '_', '0'].includes(key) ||
        event.code === 'Equal' ||
        event.code === 'Minus' ||
        event.code === 'Digit0' ||
        event.code === 'NumpadAdd' ||
        event.code === 'NumpadSubtract' ||
        event.code === 'Numpad0'
      ) {
        event.preventDefault();
      }
    };

    // 핀치 줌 (두 손가락) — 한 손가락 스크롤은 막지 않음
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };

    // iOS/Android 더블탭 줌 — 스크롤 제스처는 방해하지 않도록 짧은 간격·단일 터치만
    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length > 0 || event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      const now = Date.now();
      const dt = now - lastTapAt;
      const dx = Math.abs(touch.clientX - lastTapX);
      const dy = Math.abs(touch.clientY - lastTapY);
      if (dt > 0 && dt < 300 && dx < 24 && dy < 24) {
        event.preventDefault();
        resetViewportScale();
      }
      lastTapAt = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;
    };

    const recoverIfZoomed = () => {
      if (isZoomed()) resetViewportScale();
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKeyDown, { passive: false });
    document.addEventListener('gesturestart', prevent, { passive: false } as AddEventListenerOptions);
    document.addEventListener('gesturechange', prevent, { passive: false } as AddEventListenerOptions);
    document.addEventListener('gestureend', prevent, { passive: false } as AddEventListenerOptions);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: false });
    document.addEventListener('dblclick', prevent, { passive: false });

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', recoverIfZoomed);
    viewport?.addEventListener('scroll', recoverIfZoomed);
    window.addEventListener('resize', recoverIfZoomed);
    // 확대가 걸린 채 남는 경우 주기적으로 복구
    const timer = window.setInterval(recoverIfZoomed, 400);

    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('gesturestart', prevent);
      document.removeEventListener('gesturechange', prevent);
      document.removeEventListener('gestureend', prevent);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('dblclick', prevent);
      viewport?.removeEventListener('resize', recoverIfZoomed);
      viewport?.removeEventListener('scroll', recoverIfZoomed);
      window.removeEventListener('resize', recoverIfZoomed);
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
