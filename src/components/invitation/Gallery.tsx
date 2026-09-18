'use client';

import { useState } from 'react';
import { ALBUM_PHOTOS, PHOTOS, type Photo as PhotoData } from '@/lib/invitation';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';
import Lightbox from './Lightbox';

const album = ALBUM_PHOTOS;

/** 5p. 대표 사진 + 3×2 그리드(마지막 칸은 "더보기" → 슬라이드 팝업). */
export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const open = (photo: PhotoData) => setSelected(album.findIndex(item => item.src === photo.src));

  return (
    <Section aria-label="사진첩" className="min-h-0 justify-start gap-0 px-5 py-14">
      <div className="flex w-full flex-col items-center gap-10">
        <Reveal className="w-full max-w-[320px]">
          <Photo photo={PHOTOS.veil} sizes="320px" className="mt-12 w-full aspect-[6/4]" />
        </Reveal>

        <div className="grid w-full grid-cols-3 gap-0">
          {PHOTOS.grid.map((photo, index) => {
            const isMore = index === PHOTOS.grid.length - 1;
            return (
              <Reveal key={photo.src} delay={index * 90} className="aspect-[4/6] w-full">
                <button
                  className="relative block h-full w-full"
                  onClick={() => open(photo)}
                  aria-haspopup={isMore ? 'dialog' : undefined}
                  aria-label={isMore ? '사진 더보기, 슬라이드로 크게 보기' : `${photo.alt} 크게 보기`}
                >
                  <Photo photo={photo} sizes="30vw" className="h-full w-full" />
                  {isMore && (
                    <span className="absolute inset-0 grid place-items-center bg-black/35 text-[17px] text-white">
                      더보기
                    </span>
                  )}
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {selected !== null && (
        <Lightbox photos={album} initialIndex={selected} onClose={() => setSelected(null)} />
      )}
    </Section>
  );
}
