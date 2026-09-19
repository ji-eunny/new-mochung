'use client';

import { useState } from 'react';
import { ALBUM_PHOTOS, PHOTOS } from '@/lib/invitation';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';
import Lightbox from './Lightbox';

const album = ALBUM_PHOTOS;

/** 5p. 대표 사진 + 3×2 그리드(마지막 칸 "더보기"만 라이트박스 오픈). */
export default function Gallery() {
  const [open, setOpen] = useState(false);

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
                {isMore ? (
                  <button
                    type="button"
                    className="relative block h-full w-full"
                    onClick={() => setOpen(true)}
                    aria-haspopup="dialog"
                    aria-label="사진 더보기, 슬라이드로 크게 보기"
                  >
                    <Photo photo={photo} sizes="30vw" className="h-full w-full" />
                    <span className="absolute inset-0 grid place-items-center bg-black/35 text-[17px] text-white">
                      더보기
                    </span>
                  </button>
                ) : (
                  <div className="relative h-full w-full">
                    <Photo photo={photo} sizes="30vw" className="h-full w-full" />
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>

      {open && (
        <Lightbox key="album" photos={album} initialIndex={0} onClose={() => setOpen(false)} />
      )}
    </Section>
  );
}
