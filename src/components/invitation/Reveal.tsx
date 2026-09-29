'use client';

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

/**
 * 개별 콘텐츠가 화면에 들어올 때 아래에서 위로 떠오르는 등장 래퍼.
 *
 * - 기본 상태는 "보임". JS가 정상일 때만 `data-armed`를 켜서 숨김 → 애니메이션.
 * - 뷰포트에 들어올 때마다 다시 떠오른다(스크롤 업/다운 반복).
 * - 벗어나면 즉시 숨김 상태로 되돌려, 다시 들어올 때 연출이 재생된다.
 */
export default function Reveal({ children, className, delay = 0, ...rest }: { children: ReactNode; className?: string; delay?: number } & ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return;

    setArmed(true);

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > window.innerHeight * 0.08;
    if (inView) setVisible(true);

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          setVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.12, rootMargin: '-8% 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      data-armed={armed ? 'true' : 'false'}
      data-visible={visible ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}
