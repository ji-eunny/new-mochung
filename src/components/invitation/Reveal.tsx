'use client';

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

/**
 * 개별 콘텐츠가 화면에 들어올 때 아래에서 위로 떠오르는 등장 래퍼.
 *
 * - 기본 상태는 "보임". JS가 정상일 때만 `data-armed`를 켜서 숨김 → 애니메이션.
 * - 관찰 대상(outer)과 애니메이션(inner)을 분리해, translateY가 교차 감지를
 *   흔들어 깜빡이는 문제를 막는다.
 * - 들어오기/나가기 임계값을 다르게 두어(히스테리시스) 경계에서 토글되지 않게 한다.
 */
export default function Reveal({ children, className, delay = 0, ...rest }: { children: ReactNode; className?: string; delay?: number } & ComponentProps<'div'>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) return;

    setArmed(true);

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
    if (inView) {
      visibleRef.current = true;
      setVisible(true);
    }

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const ratio = entry.intersectionRatio;
          // 들어올 때: 충분히 보여야 표시 / 나갈 때: 거의 사라져야 숨김 → 경계 깜빡임 방지
          if (!visibleRef.current && entry.isIntersecting && ratio >= 0.2) {
            visibleRef.current = true;
            setVisible(true);
          } else if (visibleRef.current && ratio <= 0.02) {
            visibleRef.current = false;
            setVisible(false);
          }
        }
      },
      { threshold: [0, 0.02, 0.1, 0.2, 0.35, 0.5, 1], rootMargin: '0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={className} {...rest}>
      <div
        data-reveal=""
        data-armed={armed ? 'true' : 'false'}
        data-visible={visible ? 'true' : 'false'}
        style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        className="h-full w-full"
      >
        {children}
      </div>
    </div>
  );
}
