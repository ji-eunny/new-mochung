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

export default function DisableZoom() {
  useEffect(() => {
    // --------------------------------------------------
    // 1. viewport 확대 방지
    // --------------------------------------------------
    lockViewport();

    // --------------------------------------------------
    // 상태
    // --------------------------------------------------
    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    // 더블탭 후 한 손가락 드래그 확대 방지
    let blockOneFingerZoom = false;

    // 현재 터치 중인 손가락 수
    let activeTouches = 0;

    // --------------------------------------------------
    // 공통 preventDefault
    // --------------------------------------------------
    const prevent = (event: Event) => {
      event.preventDefault();
    };

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest(
          'button, a, input, textarea, select, label, summary, [role="button"], [data-allow-tap]',
        ),
      );
    };

    // --------------------------------------------------
    // 2. 터치 시작
    // --------------------------------------------------
    const onTouchStart = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      // ----------------------------------------------
      // 두 손가락 이상
      // ----------------------------------------------
      // 한 손가락을 화면에 고정하고
      // 다른 손가락으로 벌리는 핀치 줌까지 차단
      if (event.touches.length > 1) {
        event.preventDefault();

        blockOneFingerZoom = false;

        return;
      }

      // ----------------------------------------------
      // 한 손가락
      // ----------------------------------------------
      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      const now = Date.now();

      const timeSinceLastTap = now - lastTapAt;

      const distanceX = Math.abs(touch.clientX - lastTapX);
      const distanceY = Math.abs(touch.clientY - lastTapY);

      // ----------------------------------------------
      // 더블탭 확대 방지
      // 재생/공유 등 버튼·링크 위에서는 preventDefault 금지 (클릭 깨짐)
      // ----------------------------------------------
      if (
        timeSinceLastTap > 0 &&
        timeSinceLastTap < 320 &&
        distanceX < 36 &&
        distanceY < 36
      ) {
        if (!isInteractiveTarget(event.target)) {
          event.preventDefault();
          blockOneFingerZoom = true;
        } else {
          blockOneFingerZoom = false;
        }
      } else {
        blockOneFingerZoom = false;
      }

      lastTapAt = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;
    };

    // --------------------------------------------------
    // 3. 터치 이동
    // --------------------------------------------------
    const onTouchMove = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      // ----------------------------------------------
      // 멀티터치
      // ----------------------------------------------
      if (event.touches.length > 1) {
        event.preventDefault();
        return;
      }

      // ----------------------------------------------
      // 더블탭 후 드래그 확대 방지
      // ----------------------------------------------
      if (blockOneFingerZoom) {
        event.preventDefault();
        return;
      }

      // 중요:
      // 일반적인 한 손가락 터치는 preventDefault 하지 않는다.
      //
      // 따라서
      // 위로 스크롤
      // 아래로 스크롤
      //
      // 은 정상적으로 작동한다.
    };

    // --------------------------------------------------
    // 4. 터치 종료
    // --------------------------------------------------
    const onTouchEnd = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      if (event.touches.length === 0) {
        blockOneFingerZoom = false;
      }
    };

    // --------------------------------------------------
    // 5. 터치 취소
    // --------------------------------------------------
    const onTouchCancel = () => {
      activeTouches = 0;
      blockOneFingerZoom = false;
    };

    // --------------------------------------------------
    // 6. iOS Safari gesture 확대 방지
    // --------------------------------------------------
    const onGestureStart = (event: Event) => {
      event.preventDefault();
    };

    const onGestureChange = (event: Event) => {
      event.preventDefault();
    };

    const onGestureEnd = (event: Event) => {
      event.preventDefault();
    };

    // --------------------------------------------------
    // 7. 더블클릭 확대 방지
    // --------------------------------------------------
    const onDoubleClick = (event: MouseEvent) => {
      event.preventDefault();
    };

    // --------------------------------------------------
    // 8. Ctrl/Cmd + 휠 확대 방지
    // --------------------------------------------------
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    };

    // --------------------------------------------------
    // 9. Ctrl/Cmd + / - / 0 확대/축소 방지
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
    // 10. visualViewport 확대 감지
    // --------------------------------------------------
    //
    // 일부 브라우저에서는 viewport meta만으로
    // 확대를 완전히 막지 못할 수 있다.
    //
    // 확대 상태가 감지되면 viewport를 다시 잠근다.
    //
    const recoverIfZoomed = () => {
      const scale = window.visualViewport?.scale ?? 1;

      if (scale > 1.05) {
        lockViewport();
      }
    };

    // --------------------------------------------------
    // 11. visualViewport 변화 감지
    // --------------------------------------------------
    const onViewportResize = () => {
      if (activeTouches > 0) {
        recoverIfZoomed();
        return;
      }

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
      onGestureStart,
      captureOptions,
    );

    document.addEventListener(
      'gesturechange',
      onGestureChange,
      captureOptions,
    );

    document.addEventListener(
      'gestureend',
      onGestureEnd,
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
    // 혹시 브라우저가 확대를 허용했을 경우
    // 주기적으로 viewport 다시 잠금
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
        onGestureStart,
        true,
      );

      document.removeEventListener(
        'gesturechange',
        onGestureChange,
        true,
      );

      document.removeEventListener(
        'gestureend',
        onGestureEnd,
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

      // 컴포넌트가 사라져도 viewport 잠금 유지
      lockViewport();
    };
  }, []);

  return null;
}