'use client';

import { useEffect } from 'react';

/** 새로고침·재진입 시 브라우저 스크롤 복원을 끄고 맨 위로 올린다. */
export default function ScrollToTop() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const toTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    toTop();

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) toTop();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  return null;
}
