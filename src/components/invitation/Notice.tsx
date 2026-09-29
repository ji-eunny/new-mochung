'use client';

import { useRef, useState } from 'react';
import { NOTICES } from '@/lib/invitation';
import { cn } from '@/lib/utils';
import Section from './Section';
import Reveal from './Reveal';

/** LOCATION 아래. 주차·식사·포토부스 안내 슬라이더. */
export default function Notice() {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = (next: number) => {
    setIndex(Math.min(Math.max(next, 0), NOTICES.length - 1));
  };

  return (
    <Section aria-label="예식 안내" className="gap-10 text-center min-h-[60svh]">
      <Reveal>
        <p className="text-gray-400"><span>*</span> NOTICE <span>*</span></p>
      </Reveal>

      <Reveal delay={120} className="w-full">
        <div className="mx-auto w-full max-w-[300px]">
          <div
            className="overflow-hidden border-y border-neutral-200"
            onTouchStart={event => {
              const touch = event.touches[0];
              touchStart.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={event => {
              if (!touchStart.current) return;
              const touch = event.changedTouches[0];
              const dx = touch.clientX - touchStart.current.x;
              const dy = touch.clientY - touchStart.current.y;
              touchStart.current = null;
              if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
              go(index + (dx < 0 ? 1 : -1));
            }}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {NOTICES.map(notice => (
                <div
                  key={notice.title}
                  className="w-full shrink-0 px-2 py-10"
                  aria-hidden={notice.title !== NOTICES[index].title}
                >
                  <p className="text-[16px] tracking-wide text-neutral-800">{notice.title}</p>
                  <div className="mt-4 space-y-1 text-[13px] leading-[1.9] text-neutral-600">
                    {notice.lines.map((line, lineIndex) =>
                      line === '' ? (
                        <div key={`spacer-${lineIndex}`} className="h-3" aria-hidden="true" />
                      ) : (
                        <p key={line}>{line}</p>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="안내 슬라이드">
            {NOTICES.map((notice, i) => (
              <button
                key={notice.title}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${notice.title} 보기`}
                onClick={() => go(i)}
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full p-0 transition-colors',
                  i === index ? 'bg-neutral-700' : 'bg-neutral-300',
                )}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
