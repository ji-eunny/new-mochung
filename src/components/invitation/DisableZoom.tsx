'use client';

import { useEffect } from 'react';

const VIEWPORT_LOCKED =
  'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

function replaceViewport(content: string) {
  document.querySelectorAll('meta[name="viewport"]').forEach(node => node.remove());
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = content;
  document.head.appendChild(meta);
}

function viewportScale() {
  return window.visualViewport?.scale ?? 1;
}

export default function DisableZoom() {
  useEffect(() => {
    // 스크롤 중(손가락이 화면에 있는 동안)에는 배율을 건드리지 않는다.
    // 주소창이 줄며 visualViewport가 바뀔 때 확대로 오인하면 화면이 커진다.
    let recovering = false;

    const recoverIfZoomed = () => {
      if (activeTouches > 0 || recovering) return;
      if (viewportScale() <= 1.08) return;

      recovering = true;
      document.documentElement.style.zoom = '';
      replaceViewport(VIEWPORT_LOCKED);
      window.setTimeout(() => {
        recovering = false;
      }, 800);
    };

    replaceViewport(VIEWPORT_LOCKED);

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
        now - lastTapAt < 450 &&
        Math.abs(touch.clientX - lastTapX) < 48 &&
        Math.abs(touch.clientY - lastTapY) < 48;

      lastTapAt = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;

      // 한 번 탭(재생 버튼 포함)은 통과하고, 연속 탭만 확대가 되지 않게 막는다.
      if (!isDoubleTap || isAllowedTap(event.target)) {
        blockOneFingerZoom = false;
        return;
      }

      event.preventDefault();
      blockOneFingerZoom = true;
    };

    // --------------------------------------------------
    // 터치 이동
    // --------------------------------------------------
    const onTouchMove = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      if (event.touches.length > 1 || blockOneFingerZoom) {
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
      if (isAllowedTap(event.target)) return;
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

      window.removeEventListener(
        'pageshow',
        recoverIfZoomed,
      );

      window.clearInterval(timer);

      document.documentElement.style.zoom = '';
      replaceViewport(VIEWPORT_LOCKED);
    };
  }, []);

  return null;
}