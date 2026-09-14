import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * 청첩장 한 페이지(PDF 한 장) = 한 섹션.
 * 모바일 화면을 세로로 꽉 채우고(`min-h-[100svh]`) 콘텐츠를 세로 중앙 정렬한다.
 * (등장 애니메이션은 섹션 단위가 아니라 내부 콘텐츠를 감싼 Reveal이 담당한다.)
 */
export default function Section({ children, className, ...rest }: { children: ReactNode; className?: string } & ComponentProps<'section'>) {
  return (
    <section
      className={cn('flex min-h-[100svh] w-full flex-col items-center justify-center px-8 py-14', className)}
      {...rest}
    >
      {children}
    </section>
  );
}
