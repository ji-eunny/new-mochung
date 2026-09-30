'use client';

import { useState } from 'react';
import { ALBUM_PHOTOS, PHOTOS } from '@/lib/invitation';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';
import Lightbox from './Lightbox';

const album = ALBUM_PHOTOS;

/** 5p. 대표 사진 + 3×2 그리드(일반 칸은 개별 팝업, 마지막 칸 "더보기"는 앨범). */
export default function Gallery() {
  const [albumOpen, setAlbumOpen] = useState(false);
  const [popupPhoto, setPopupPhoto] = useState<(typeof PHOTOS.grid)[number] | typeof PHOTOS.veil | null>(null);

  return (
    <Section aria-label="사진첩" className="min-h-0 justify-start gap-0 px-0 py-14">
      <div className="flex w-full flex-col items-center gap-10">
        <Reveal className="w-full max-w-[320px] px-5">
          <button
            type="button"
            className="mt-12 block w-full touch-manipulation"
            onClick={() => setPopupPhoto(PHOTOS.veil)}
            aria-haspopup="dialog"
            aria-label={`${PHOTOS.veil.alt} 크게 보기`}
          >
            <Photo photo={PHOTOS.veil} sizes="320px" className="w-full aspect-[6/4]" />
          </button>
        </Reveal>

        <Reveal delay={120} className="w-full">
          <div className="grid w-full grid-cols-3 gap-0 overflow-hidden leading-none">
            {PHOTOS.grid.map((photo, index) => {
              const isMore = index === PHOTOS.grid.length - 1;
              return (
                <div key={`${photo.src}-${index}`} className="aspect-[4/6] w-full">
                  {isMore ? (
                    <button
                      type="button"
                      className="relative block h-full w-full touch-manipulation"
                      onClick={() => setAlbumOpen(true)}
                      aria-haspopup="dialog"
                      aria-label="사진 더보기, 슬라이드로 크게 보기"
                    >
                      <Photo photo={photo} sizes="30vw" className="h-full w-full" />
                      <span className="absolute inset-0 grid place-items-center bg-black/35 text-[17px] text-white">
                        더보기
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="relative block h-full w-full touch-manipulation"
                      onClick={() => setPopupPhoto(photo)}
                      aria-haspopup="dialog"
                      aria-label={`${photo.alt} 크게 보기`}
                    >
                      <Photo photo={photo} sizes="30vw" className="h-full w-full" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {albumOpen && (
        <Lightbox key="album" photos={album} initialIndex={0} onClose={() => setAlbumOpen(false)} />
      )}

      {popupPhoto && (
        <Lightbox
          key={`popup-${popupPhoto.src}`}
          photos={[popupPhoto]}
          initialIndex={0}
          onClose={() => setPopupPhoto(null)}
        />
      )}
    </Section>
  );
}
