'use client';

import { useEffect } from 'react';

const VIEWPORT_LOCKED =
  'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

/** 새로고침 직후에만 잠깐 열어, 이미 커진 배율을 1로 되돌린다. */
const VIEWPORT_OPEN =
  'width=device-width, initial-scale=1, minimum-scale=0.25, maximum-scale=5, user-scalable=yes, viewport-fit=cover';

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

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** 새로고침·재진입 시에만 배율을 강제로 1로 되돌린다. */
function resetViewportHard() {
  document.documentElement.style.zoom = '';
  replaceViewport(VIEWPORT_OPEN);
  void document.documentElement.offsetWidth;
  replaceViewport(VIEWPORT_LOCKED);
  scrollToTop();

  const scale = viewportScale();
  if (scale > 1.02) {
    document.documentElement.style.zoom = String(1 / scale);
  }
}

export default function DisableZoom() {
  useEffect(() => {
    let lastTapAt = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    let blockOneFingerZoom = false;
    let activeTouches = 0;
    let isScrolling = false;
    let scrollIdleTimer = 0;
    let touchOrigin: { x: number; y: number } | null = null;
    /** 손가락으로 세로 스크롤을 끄는 중 */
    let scrollGesture = false;
    let suppressClick = false;

    // 관성 스크롤 동안 새 터치(핀치 포함)를 가로채는 투명 막
    const blocker = document.createElement('div');
    blocker.setAttribute('aria-hidden', 'true');
    blocker.setAttribute('data-scroll-blocker', 'true');
    blocker.style.cssText =
      'position:fixed;inset:0;z-index:2147483646;touch-action:none;background:transparent;display:none;';

    const blockTouch = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    blocker.addEventListener('touchstart', blockTouch, { passive: false, capture: true });
    blocker.addEventListener('touchmove', blockTouch, { passive: false, capture: true });
    blocker.addEventListener('touchend', blockTouch, { passive: false, capture: true });
    blocker.addEventListener('gesturestart', blockTouch, { passive: false, capture: true });
    blocker.addEventListener('gesturechange', blockTouch, { passive: false, capture: true });
    blocker.addEventListener('gestureend', blockTouch, { passive: false, capture: true });
    document.body.appendChild(blocker);

    const showBlocker = () => {
      blocker.style.display = 'block';
    };

    const hideBlocker = () => {
      blocker.style.display = 'none';
    };

    const markScrolling = (withBlocker = false) => {
      isScrolling = true;
      suppressClick = true;
      if (withBlocker || activeTouches === 0) showBlocker();

      window.clearTimeout(scrollIdleTimer);
      // iOS 관성 스크롤은 1초 넘게 이어질 수 있다.
      scrollIdleTimer = window.setTimeout(() => {
        isScrolling = false;
        scrollGesture = false;
        suppressClick = false;
        hideBlocker();
      }, 900);
    };

    const isAllowedTap = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      return !!target.closest('[data-allow-tap]');
    };

    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    const onScroll = () => {
      // 손을 떼고 화면이 미끄러지는 동안에도 계속 잠근다.
      markScrolling(true);
    };

    const onTouchStart = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      // 두 손가락 이상은 항상 차단
      if (event.touches.length > 1) {
        event.preventDefault();
        blockOneFingerZoom = false;
        return;
      }

      // 관성 스크롤 중에는 새 터치를 전부 막아 핀치가 시작되지 않게 한다.
      if (isScrolling && !scrollGesture) {
        event.preventDefault();
        suppressClick = true;
        showBlocker();
        return;
      }

      const touch = event.touches[0];
      if (!touch) return;

      touchOrigin = { x: touch.clientX, y: touch.clientY };

      if (scrollGesture) {
        suppressClick = true;
        blockOneFingerZoom = false;
        return;
      }

      const now = Date.now();
      const isDoubleTap =
        now - lastTapAt > 0 &&
        now - lastTapAt < 450 &&
        Math.abs(touch.clientX - lastTapX) < 48 &&
        Math.abs(touch.clientY - lastTapY) < 48;

      lastTapAt = now;
      lastTapX = touch.clientX;
      lastTapY = touch.clientY;

      if (!isDoubleTap || isAllowedTap(event.target)) {
        blockOneFingerZoom = false;
        return;
      }

      event.preventDefault();
      blockOneFingerZoom = true;
    };

    const onTouchMove = (event: TouchEvent) => {
      activeTouches = event.touches.length;

      if (event.touches.length > 1 || blockOneFingerZoom) {
        event.preventDefault();
        return;
      }

      // 스크롤 중 두 번째 손가락이 들어오면 막는다.
      if ((isScrolling || scrollGesture) && event.touches.length > 1) {
        event.preventDefault();
        return;
      }

      const touch = event.touches[0];
      if (touch && touchOrigin) {
        const dx = Math.abs(touch.clientX - touchOrigin.x);
        const dy = Math.abs(touch.clientY - touchOrigin.y);
        if (dy > 8 && dy > dx) {
          scrollGesture = true;
          markScrolling(false);
        }
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      activeTouches = event.touches.length;
      if (event.touches.length === 0) {
        blockOneFingerZoom = false;
        touchOrigin = null;
        // 손을 떼는 순간부터 관성 스크롤용 막 표시
        if (scrollGesture || isScrolling) {
          markScrolling(true);
        }
      }
    };

    const onTouchCancel = () => {
      activeTouches = 0;
      blockOneFingerZoom = false;
      touchOrigin = null;
      if (scrollGesture || isScrolling) markScrolling(true);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!suppressClick && !isScrolling) return;
      if (event.pointerType !== 'touch' || isAllowedTap(event.target)) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('button, a, [role="button"]')) {
        event.preventDefault();
      }
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick && !isScrolling) return;
      if (isAllowedTap(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const onDoubleClick = (event: MouseEvent) => {
      if (isAllowedTap(event.target)) return;
      event.preventDefault();
    };

    const onWheel = (event: WheelEvent) => {
      markScrolling(true);
      if (event.ctrlKey || event.metaKey) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      const zoomKeys = ['+', '-', '=', '_', '0'];
      const zoomCodes = ['Equal', 'Minus', 'Digit0', 'NumpadAdd', 'NumpadSubtract', 'Numpad0'];
      if (zoomKeys.includes(key) || zoomCodes.includes(event.code)) event.preventDefault();
    };

    const onPageShow = () => {
      resetViewportHard();
    };

    const captureOptions: AddEventListenerOptions = { passive: false, capture: true };
    const normalOptions: AddEventListenerOptions = { passive: false };

    resetViewportHard();

    document.addEventListener('touchstart', onTouchStart, captureOptions);
    document.addEventListener('touchmove', onTouchMove, captureOptions);
    document.addEventListener('touchend', onTouchEnd, captureOptions);
    document.addEventListener('touchcancel', onTouchCancel, captureOptions);
    document.addEventListener('pointerdown', onPointerDown, captureOptions);
    document.addEventListener('click', onClickCapture, captureOptions);
    document.addEventListener('gesturestart', preventGesture, captureOptions);
    document.addEventListener('gesturechange', preventGesture, captureOptions);
    document.addEventListener('gestureend', preventGesture, captureOptions);
    document.addEventListener('dblclick', onDoubleClick, normalOptions);
    document.addEventListener('wheel', onWheel, normalOptions);
    document.addEventListener('keydown', onKeyDown, normalOptions);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('pageshow', onPageShow);

    const timer = window.setInterval(() => {
      if (activeTouches > 0 || isScrolling || scrollGesture) return;
      if (viewportScale() <= 1.08) {
        if (document.documentElement.style.zoom) document.documentElement.style.zoom = '';
        return;
      }
      replaceViewport(VIEWPORT_LOCKED);
    }, 700);

    return () => {
      document.removeEventListener('touchstart', onTouchStart, true);
      document.removeEventListener('touchmove', onTouchMove, true);
      document.removeEventListener('touchend', onTouchEnd, true);
      document.removeEventListener('touchcancel', onTouchCancel, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('click', onClickCapture, true);
      document.removeEventListener('gesturestart', preventGesture, true);
      document.removeEventListener('gesturechange', preventGesture, true);
      document.removeEventListener('gestureend', preventGesture, true);
      document.removeEventListener('dblclick', onDoubleClick);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('pageshow', onPageShow);
      window.clearInterval(timer);
      window.clearTimeout(scrollIdleTimer);
      blocker.remove();
      document.documentElement.style.zoom = '';
      replaceViewport(VIEWPORT_LOCKED);
    };
  }, []);

  return null;
}
