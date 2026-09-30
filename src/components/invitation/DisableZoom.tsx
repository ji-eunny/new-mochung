'use client';

import { useEffect } from 'react';

const VIEWPORT_LOCKED =
  'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

let isResetting = false;

function lockViewport() {
  document.querySelector('meta[name="viewport"]')?.setAttribute('content', VIEWPORT_LOCKED);
}

function currentScale() {
  return window.visualViewport?.scale ?? 1;
}

function isClearlyZoomed() {
  return currentScale() > 1.05;
}

/** 확대 고착 복구 — 스크롤 위치 유지, CSS zoom 미사용 */
function resetViewportScale() {
  if (isResetting || !isClearlyZoomed()) return;
  const meta = document.querySelector('meta[name="viewport"]');
  if (!meta) return;

  isResetting = true;
  const scrollY = window.scrollY || window.pageYOffset || 0;

  meta.setAttribute(
    'content',
    'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover',
  );

  window.setTimeout(() => {
    meta.setAttribute(
      'content',
      'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=yes, viewport-fit=cover',
    );
    window.setTimeout(() => {
      lockViewport();
      window.scrollTo(0, scrollY);
      isResetting = false;
    }, 80);
  }, 80);
}

/**
 * - 두 손가락 핀치(한 손 고정 + 한 손 확대 포함) 차단
 * - iOS 더블탭·더블탭-드래그 줌 차단
 * - 한 손가락 일반 스크롤은 preventDefault 하지 않음
 */
export default function DisableZoom() {
  useEffect(() => {
    lockViewport();

    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    /** 더블탭 두 번째 터치가 유지·드래그 중이면 true (한 손가락 줌) */
    let blockOneFingerZoom = false;
    let activeTouches = 0;

    const prevent = (event: Event) => {
      event.preventDefault();
    };

    const onTouchStart = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      // 한 손가락 고정 + 다른 손가락 확대 = touches >= 2
      if (event.touches.length > 1) {
        event.preventDefault();
        blockOneFingerZoom = false;
        if (isClearlyZoomed()) resetViewportScale();
        return;
      }

      const touch = event.touches[0];
      if (!touch) return;

      const now = Date.now();
      const dt = now - lastTapAt;
      const dx = Math.abs(touch.clientX - lastTapX);
      const dy = Math.abs(touch.clientY - lastTapY);

      // 더블탭(또는 더블탭 후 드래그 줌) 시작 — 두 번째 탭에서 차단
      if (dt > 0 && dt < 320 && dx < 36 && dy < 36) {
        event.preventDefault();
        blockOneFingerZoom = true;
        if (isClearlyZoomed()) resetViewportScale();
      } else {
        blockOneFingerZoom = false;
      }

      lastTapAt = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      if (event.touches.length > 1) {
        event.preventDefault();
        if (isClearlyZoomed()) resetViewportScale();
        return;
      }

      // 더블탭-드래그 줌: 손가락 하나지만 확대를 시도하는 경우
      if (blockOneFingerZoom) {
        event.preventDefault();
        if (isClearlyZoomed()) resetViewportScale();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      if (event.touches.length === 0) {
        blockOneFingerZoom = false;
      }

      // 멀티터치가 끝나며 확대가 남았을 때 복구
      if (isClearlyZoomed()) {
        resetViewportScale();
      }
    };

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

    const recoverIfZoomed = () => {
      if (isClearlyZoomed()) resetViewportScale();
    };

    // 터치 중 scale이 변하면 즉시 복구 (한손+한손 / 더블탭 드래그 모두 대응)
    const onViewportResize = () => {
      if (activeTouches > 0 || isClearlyZoomed()) recoverIfZoomed();
    };

    const opts: AddEventListenerOptions = { passive: false };
    const optsCapture: AddEventListenerOptions = { passive: false, capture: true };

    document.addEventListener('touchstart', onTouchStart, optsCapture);
    document.addEventListener('touchmove', onTouchMove, optsCapture);
    document.addEventListener('touchend', onTouchEnd, optsCapture);
    document.addEventListener('touchcancel', onTouchEnd, optsCapture);
    document.addEventListener('gesturestart', prevent, optsCapture);
    document.addEventListener('gesturechange', prevent, optsCapture);
    document.addEventListener('gestureend', prevent, optsCapture);
    document.addEventListener('dblclick', prevent, opts);
    document.addEventListener('wheel', onWheel, opts);
    document.addEventListener('keydown', onKeyDown, opts);

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', onViewportResize);
    window.addEventListener('pageshow', recoverIfZoomed);

    const timer = window.setInterval(recoverIfZoomed, 800);

    return () => {
      document.removeEventListener('touchstart', onTouchStart, true);
      document.removeEventListener('touchmove', onTouchMove, true);
      document.removeEventListener('touchend', onTouchEnd, true);
      document.removeEventListener('touchcancel', onTouchEnd, true);
      document.removeEventListener('gesturestart', prevent, true);
      document.removeEventListener('gesturechange', prevent, true);
      document.removeEventListener('gestureend', prevent, true);
      document.removeEventListener('dblclick', prevent);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
      viewport?.removeEventListener('resize', onViewportResize);
      window.removeEventListener('pageshow', recoverIfZoomed);
      window.clearInterval(timer);
      lockViewport();
    };
  }, []);

  return null;
}
