'use client';

import { useEffect } from 'react';

/** 모바일 핀치/더블탭, PC Ctrl·Cmd 휠·단축키 확대를 최대한 막는다. */
export default function DisableZoom() {
  useEffect(() => {
    const prevent = (event: Event) => event.preventDefault();

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      if (['+', '-', '=', '_', '0', 'digit0', 'numpadadd', 'numpadsubtract', 'numpad0'].includes(key) || event.code === 'Equal' || event.code === 'Minus' || event.code === 'Digit0') {
        event.preventDefault();
      }
    };

    // 핀치 줌 (두 손가락)
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
    };

    // iOS 더블탭 줌
    let lastTouchEnd = 0;
    const onTouchEnd = (event: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 350) event.preventDefault();
      lastTouchEnd = now;
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKeyDown, { passive: false });
    document.addEventListener('gesturestart', prevent, { passive: false });
    document.addEventListener('gesturechange', prevent, { passive: false });
    document.addEventListener('gestureend', prevent, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: false });
    document.addEventListener('dblclick', prevent, { passive: false });

    // 확대가 걸린 경우 visualViewport로 감지해 스크롤 보정 시도
    const viewport = window.visualViewport;
    const onViewport = () => {
      if (!viewport) return;
      if (Math.abs(viewport.scale - 1) > 0.01) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    };
    viewport?.addEventListener('resize', onViewport);
    viewport?.addEventListener('scroll', onViewport);

    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('gesturestart', prevent);
      document.removeEventListener('gesturechange', prevent);
      document.removeEventListener('gestureend', prevent);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('dblclick', prevent);
      viewport?.removeEventListener('resize', onViewport);
      viewport?.removeEventListener('scroll', onViewport);
    };
  }, []);

  return null;
}
