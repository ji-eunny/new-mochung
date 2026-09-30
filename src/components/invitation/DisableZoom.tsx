'use client';

import { useEffect } from 'react';

const VIEWPORT_LOCKED =
  'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

function lockViewport() {
  const meta = document.querySelector('meta[name="viewport"]');

  if (meta) {
    meta.setAttribute('content', VIEWPORT_LOCKED);
  }
}

function isZoomed() {
  return (window.visualViewport?.scale ?? 1) > 1.05;
}

export default function DisableZoom() {
  useEffect(() => {
    // --------------------------------------------------
    // viewport 확대 잠금
    // --------------------------------------------------
    lockViewport();

    // --------------------------------------------------
    // 상태
    // --------------------------------------------------
    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    // 더블탭 후 드래그 확대 차단
    let blockOneFingerZoom = false;

    // 현재 터치 중인 손가락 수
    let activeTouches = 0;

    // --------------------------------------------------
    // 해당 요소가 정상적인 탭을 허용하는지 확인
    //
    // WeddingVideo의
    // data-allow-tap="true"
    // 같은 요소를 대상으로 함
    // --------------------------------------------------
    const isAllowedTap = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      return !!target.closest('[data-allow-tap]');
    };

    // --------------------------------------------------
    // iOS gesture 확대 방지
    // --------------------------------------------------
    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    // --------------------------------------------------
    // 터치 시작
    // --------------------------------------------------
    const onTouchStart = (event: TouchEvent) => {
      activeTouches = event.touches.length;
    
      // ⭐ 재생 버튼 등 허용된 터치는 가장 먼저 통과
      if (isAllowedTap(event.target)) {
        blockOneFingerZoom = false;
    
        const touch = event.touches[0];
    
        if (touch) {
          lastTapAt = Date.now();
          lastTapX = touch.clientX;
          lastTapY = touch.clientY;
        }
    
        return;
      }
    
      // 두 손가락은 무조건 차단
      if (event.touches.length > 1) {
        event.preventDefault();
        blockOneFingerZoom = false;
        return;
      }
    
      const touch = event.touches[0];
    
      if (!touch) return;
    
      const now = Date.now();
      const timeSinceLastTap = now - lastTapAt;
    
      const distanceX = Math.abs(touch.clientX - lastTapX);
      const distanceY = Math.abs(touch.clientY - lastTapY);
    
      if (
        timeSinceLastTap > 0 &&
        timeSinceLastTap < 320 &&
        distanceX < 36 &&
        distanceY < 36
      ) {
        event.preventDefault();
        blockOneFingerZoom = true;
      } else {
        blockOneFingerZoom = false;
      }
    
      lastTapAt = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;
    };

    // --------------------------------------------------
    // 터치 이동
    // --------------------------------------------------
    const onTouchMove = (event: TouchEvent) => {
      activeTouches = event.touches.length;
    
      // ⭐ 재생 버튼 위에서는 터치 이벤트를 막지 않음
      if (isAllowedTap(event.target)) {
        return;
      }
    
      // 두 손가락 확대 차단
      if (event.touches.length > 1) {
        event.preventDefault();
        return;
      }
    
      // 더블탭 확대 방지
      if (blockOneFingerZoom) {
        event.preventDefault();
      }
    };

    // --------------------------------------------------
    // 터치 종료
    // --------------------------------------------------
    const onTouchEnd = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      if (event.touches.length === 0) {
        blockOneFingerZoom = false;
      }
    };

    // --------------------------------------------------
    // 터치 취소
    // --------------------------------------------------
    const onTouchCancel = () => {
      activeTouches = 0;
      blockOneFingerZoom = false;
    };

    // --------------------------------------------------
    // 더블클릭 확대 차단
    // --------------------------------------------------
    const onDoubleClick = (event: MouseEvent) => {
      // 허용된 버튼은 정상적으로 클릭 가능
      if (isAllowedTap(event.target)) {
        return;
      }

      event.preventDefault();
    };

    // --------------------------------------------------
    // Ctrl / Cmd + 휠 확대 차단
    // --------------------------------------------------
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    // --------------------------------------------------
    // Ctrl / Cmd + +/-/0 확대·축소 차단
    // --------------------------------------------------
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) {
        return;
      }

      const key = event.key.toLowerCase();

      const zoomKeys = [
        '+',
        '-',
        '=',
        '_',
        '0',
      ];

      const zoomCodes = [
        'Equal',
        'Minus',
        'Digit0',
        'NumpadAdd',
        'NumpadSubtract',
        'Numpad0',
      ];

      if (
        zoomKeys.includes(key) ||
        zoomCodes.includes(event.code)
      ) {
        event.preventDefault();
      }
    };

    // --------------------------------------------------
    // 브라우저가 확대를 허용했는지 확인
    // --------------------------------------------------
    const recoverIfZoomed = () => {
      if (isZoomed()) {
        lockViewport();
      }
    };

    // --------------------------------------------------
    // visualViewport 크기 변화
    // --------------------------------------------------
    const onViewportResize = () => {
      recoverIfZoomed();
    };

    // --------------------------------------------------
    // 이벤트 옵션
    // --------------------------------------------------
    const captureOptions: AddEventListenerOptions = {
      passive: false,
      capture: true,
    };

    const normalOptions: AddEventListenerOptions = {
      passive: false,
    };

    // --------------------------------------------------
    // 이벤트 등록
    // --------------------------------------------------

    document.addEventListener(
      'touchstart',
      onTouchStart,
      captureOptions,
    );

    document.addEventListener(
      'touchmove',
      onTouchMove,
      captureOptions,
    );

    document.addEventListener(
      'touchend',
      onTouchEnd,
      captureOptions,
    );

    document.addEventListener(
      'touchcancel',
      onTouchCancel,
      captureOptions,
    );

    document.addEventListener(
      'gesturestart',
      preventGesture,
      captureOptions,
    );

    document.addEventListener(
      'gesturechange',
      preventGesture,
      captureOptions,
    );

    document.addEventListener(
      'gestureend',
      preventGesture,
      captureOptions,
    );

    document.addEventListener(
      'dblclick',
      onDoubleClick,
      normalOptions,
    );

    document.addEventListener(
      'wheel',
      onWheel,
      normalOptions,
    );

    document.addEventListener(
      'keydown',
      onKeyDown,
      normalOptions,
    );

    const viewport = window.visualViewport;

    viewport?.addEventListener(
      'resize',
      onViewportResize,
    );

    window.addEventListener(
      'pageshow',
      recoverIfZoomed,
    );

    // --------------------------------------------------
    // 혹시 브라우저가 확대 상태로 남았을 경우
    // 주기적으로 viewport 잠금
    // --------------------------------------------------
    const timer = window.setInterval(
      recoverIfZoomed,
      500,
    );

    // --------------------------------------------------
    // Cleanup
    // --------------------------------------------------
    return () => {
      document.removeEventListener(
        'touchstart',
        onTouchStart,
        true,
      );

      document.removeEventListener(
        'touchmove',
        onTouchMove,
        true,
      );

      document.removeEventListener(
        'touchend',
        onTouchEnd,
        true,
      );

      document.removeEventListener(
        'touchcancel',
        onTouchCancel,
        true,
      );

      document.removeEventListener(
        'gesturestart',
        preventGesture,
        true,
      );

      document.removeEventListener(
        'gesturechange',
        preventGesture,
        true,
      );

      document.removeEventListener(
        'gestureend',
        preventGesture,
        true,
      );

      document.removeEventListener(
        'dblclick',
        onDoubleClick,
      );

      document.removeEventListener(
        'wheel',
        onWheel,
      );

      document.removeEventListener(
        'keydown',
        onKeyDown,
      );

      viewport?.removeEventListener(
        'resize',
        onViewportResize,
      );

      window.removeEventListener(
        'pageshow',
        recoverIfZoomed,
      );

      window.clearInterval(timer);

      lockViewport();
    };
  }, []);

  return null;
}