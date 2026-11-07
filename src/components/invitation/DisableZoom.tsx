'use client';

import { useEffect } from 'react';

const VIEWPORT_LOCKED =
  'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

function lockViewport() {
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) meta.setAttribute('content', VIEWPORT_LOCKED);
}

/** 화면 기본 확대 방지: viewport 잠금, 두 손가락·더블탭·제스처 차단. */
export default function DisableZoom() {
  useEffect(() => {
    lockViewport();

    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    let blockOneFingerZoom = false;

    const isAllowedTap = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return !!target.closest('[data-allow-tap]');
    };

    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      if (isAllowedTap(event.target)) {
        blockOneFingerZoom = false;
        return;
      }

      if (event.touches.length > 1) {
        event.preventDefault();
        blockOneFingerZoom = false;
        return;
      }

      const touch = event.touches[0];
      if (!touch) return;

      const now = Date.now();
      const isDoubleTap =
        now - lastTapAt > 0 &&
        now - lastTapAt < 320 &&
        Math.abs(touch.clientX - lastTapX) < 36 &&
        Math.abs(touch.clientY - lastTapY) < 36;

      lastTapAt = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;

      if (isDoubleTap) {
        event.preventDefault();
        blockOneFingerZoom = true;
      } else {
        blockOneFingerZoom = false;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (isAllowedTap(event.target)) return;
      if (event.touches.length > 1 || blockOneFingerZoom) event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length === 0) blockOneFingerZoom = false;
    };

    const onTouchCancel = () => {
      blockOneFingerZoom = false;
    };

    const onDoubleClick = (event: MouseEvent) => {
      if (isAllowedTap(event.target)) return;
      event.preventDefault();
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      const zoomKeys = ['+', '-', '=', '_', '0'];
      const zoomCodes = ['Equal', 'Minus', 'Digit0', 'NumpadAdd', 'NumpadSubtract', 'Numpad0'];
      if (zoomKeys.includes(key) || zoomCodes.includes(event.code)) event.preventDefault();
    };

    const capture: AddEventListenerOptions = { passive: false, capture: true };
    const normal: AddEventListenerOptions = { passive: false };

    document.addEventListener('touchstart', onTouchStart, capture);
    document.addEventListener('touchmove', onTouchMove, capture);
    document.addEventListener('touchend', onTouchEnd, capture);
    document.addEventListener('touchcancel', onTouchCancel, capture);
    document.addEventListener('gesturestart', preventGesture, capture);
    document.addEventListener('gesturechange', preventGesture, capture);
    document.addEventListener('gestureend', preventGesture, capture);
    document.addEventListener('dblclick', onDoubleClick, normal);
    document.addEventListener('wheel', onWheel, normal);
    document.addEventListener('keydown', onKeyDown, normal);

    return () => {
      document.removeEventListener('touchstart', onTouchStart, true);
      document.removeEventListener('touchmove', onTouchMove, true);
      document.removeEventListener('touchend', onTouchEnd, true);
      document.removeEventListener('touchcancel', onTouchCancel, true);
      document.removeEventListener('gesturestart', preventGesture, true);
      document.removeEventListener('gesturechange', preventGesture, true);
      document.removeEventListener('gestureend', preventGesture, true);
      document.removeEventListener('dblclick', onDoubleClick);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
      lockViewport();
    };
  }, []);

  return null;
}
