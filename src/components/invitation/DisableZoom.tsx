'use client';

import { useEffect } from 'react';

const VIEWPORT_LOCKED =
  'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

let isResetting = false;

function lockViewport() {
  document.querySelector('meta[name="viewport"]')?.setAttribute('content', VIEWPORT_LOCKED);
}

/** 확실히 확대된 경우만 (미세 오차로 스크롤 복구가 도는 것 방지) */
function isClearlyZoomed() {
  const scale = window.visualViewport?.scale ?? 1;
  return scale > 1.05;
}

/**
 * 확대 고착 복구. 스크롤 중에는 호출하지 않는다.
 * CSS zoom / overflow 조작은 스크롤을 깨뜨리므로 쓰지 않는다.
 */
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
 * 핀치·제스처 확대만 막고, 한 손가락 세로 스크롤은 절대 건드리지 않는다.
 * 더블탭은 CSS touch-action: manipulation 에 맡긴다.
 */
export default function DisableZoom() {
  useEffect(() => {
    lockViewport();

    const prevent = (event: Event) => {
      event.preventDefault();
    };

    /** 두 손가락만 차단 — 한 손가락 touchmove에는 preventDefault 금지 */
    const blockPinch = (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault();
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

    const opts: AddEventListenerOptions = { passive: false };
    const optsCapture: AddEventListenerOptions = { passive: false, capture: true };

    document.addEventListener('touchstart', blockPinch, optsCapture);
    document.addEventListener('touchmove', blockPinch, optsCapture);
    document.addEventListener('gesturestart', prevent, optsCapture);
    document.addEventListener('gesturechange', prevent, optsCapture);
    document.addEventListener('gestureend', prevent, optsCapture);
    document.addEventListener('dblclick', prevent, opts);
    document.addEventListener('wheel', onWheel, opts);
    document.addEventListener('keydown', onKeyDown, opts);

    // resize만 — scroll 리스너는 일반 스크롤과 싸우므로 쓰지 않음
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', recoverIfZoomed);
    window.addEventListener('pageshow', recoverIfZoomed);

    // 드물게 고착됐을 때만 복구 (스크롤과 안 겹치게 느리게)
    const timer = window.setInterval(recoverIfZoomed, 1200);

    return () => {
      document.removeEventListener('touchstart', blockPinch, true);
      document.removeEventListener('touchmove', blockPinch, true);
      document.removeEventListener('gesturestart', prevent, true);
      document.removeEventListener('gesturechange', prevent, true);
      document.removeEventListener('gestureend', prevent, true);
      document.removeEventListener('dblclick', prevent);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
      viewport?.removeEventListener('resize', recoverIfZoomed);
      window.removeEventListener('pageshow', recoverIfZoomed);
      window.clearInterval(timer);
      lockViewport();
    };
  }, []);

  return null;
}
