'use client';

import { useState } from 'react';
import { PHOTOS } from '@/lib/invitation';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';
import Lightbox from './Lightbox';

/** 4p. 사진 세 장을 엇갈리게 배치한 콜라주(좌상 · 우하 · 하단중앙). */
export default function Portraits() {
  const portraits = PHOTOS.portraits;
  const [left, right, bottom] = portraits;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section aria-label="우리의 웨딩 사진" className="px-5">
      <Reveal><p className="text-gray-400 mt-[-16px]"><span>*</span> PHOTOS <span>*</span></p></Reveal>
      <div className="relative mx-auto mt-12 aspect-[2/3] w-full max-w-[420px]">
        <Reveal className="absolute left-[7%] top-[3%] aspect-[2/3] w-[40%]">
          <button
            type="button"
            className="relative block h-full w-full touch-manipulation"
            onClick={() => setOpenIndex(0)}
            aria-haspopup="dialog"
            aria-label={`${left.alt} 크게 보기`}
          >
            <Photo photo={left} sizes="40vw" className="h-full w-full" />
          </button>
        </Reveal>
        <Reveal delay={160} className="absolute left-[56%] top-[14%] aspect-[2/3] w-[40%]">
          <button
            type="button"
            className="relative block h-full w-full touch-manipulation"
            onClick={() => setOpenIndex(1)}
            aria-haspopup="dialog"
            aria-label={`${right.alt} 크게 보기`}
          >
            <Photo photo={right} sizes="40vw" className="h-full w-full" />
          </button>
        </Reveal>
        <Reveal delay={320} className="absolute left-[20%] top-[60%] aspect-[2/3] w-[60%]">
          <button
            type="button"
            className="relative block h-full w-full touch-manipulation"
            onClick={() => setOpenIndex(2)}
            aria-haspopup="dialog"
            aria-label={`${bottom.alt} 크게 보기`}
          >
            <Photo photo={bottom} sizes="45vw" className="h-full w-full" />
          </button>
        </Reveal>
      </div>

      {openIndex !== null && (
        <Lightbox
          key={`portrait-${openIndex}`}
          photos={[portraits[openIndex]]}
          initialIndex={0}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </Section>
  );
}
