'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/** `\n`은 한 줄로 두면 글자가 잘릴 때만 줄바꿈으로 쓴다. */
export default function SoftBreak({ text, className }: { text: string; className?: string }) {
  const boxRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const [broken, setBroken] = useState(false);
  const single = text.replace(/\n/g, ' ');

  useEffect(() => {
    const box = boxRef.current;
    const line = lineRef.current;
    if (!box || !line) return;

    const update = () => setBroken(line.offsetWidth > box.clientWidth + 1);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(box);
    observer.observe(line);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) update();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [single]);

  const parts = text.split('\n');

  return (
    <p ref={boxRef} className={cn('relative w-full min-w-0 overflow-hidden', !broken && 'whitespace-nowrap', className)}>
      <span ref={lineRef} className="pointer-events-none invisible absolute whitespace-nowrap" aria-hidden>
        {single}
      </span>
      {broken
        ? parts.map((part, index) => (
            <span key={`${part}-${index}`}>
              {index > 0 && <br />}
              {part}
            </span>
          ))
        : single}
    </p>
  );
}
