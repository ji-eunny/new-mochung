'use client';

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react';

/**
 * 개별 콘텐츠가 화면에 들어올 때 아래에서 위로 떠오르는 등장 래퍼.
 *
 * 안정성 원칙(모바일에서 콘텐츠가 사라지지 않도록):
 * - 기본 상태는 "보임". JS가 정상일 때만 `data-armed`를 켜서 숨김 → 애니메이션을 건다.
 *   JS 지연/실패/캐시 문제 시엔 armed 되지 않아 콘텐츠가 항상 보인다.
 * - 첫 화면(마운트 시 이미 보이는 요소)은 즉시 표시(깜빡임 없이).
 * - 그 외 요소는 IntersectionObserver로 "화면에 들어오는 순간"에만 떠오른다(시간 경과로 미리 뜨지 않음).
 * - 애니메이션은 globals.css의 `[data-reveal][data-armed='true']` 규칙이 담당한다.
 */
export default function Reveal({ children, className, delay = 0, ...rest }: { children: ReactNode; className?: string; delay?: number } & ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // IO 미지원 → armed 하지 않음(=계속 보임).
    if (!('IntersectionObserver' in window)) return;

    // 첫 화면에 이미 보이는 요소: 깜빡임 없이 즉시 표시(armed+visible 동시).
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      setArmed(true);
      setVisible(true);
      return;
    }

    // 아래쪽 요소: 숨긴 뒤, 화면에 들어오는 순간 떠오르게 한다.
    setArmed(true);
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) { setVisible(true); observer.disconnect(); break; }
        }
      },
      // 하단 제외 구역을 두면 페이지 맨 끝 요소(예: 저작권)가 끝내 감지되지 않는다.
      // → rootMargin 0으로 두고, 살짝 보이면(threshold) 등장시킨다.
      { threshold: 0.1, rootMargin: '0px' },
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
