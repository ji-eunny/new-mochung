'use client';

import { useRef, useState } from 'react';
import { MORE_PHOTOS, PHOTOS, type Photo as PhotoData } from '@/lib/invitation';
import Photo from './Photo';
import GalleryLightbox from './GalleryLightbox';

const album = [...PHOTOS.triptych, PHOTOS.pajamas, PHOTOS.veil, ...PHOTOS.grid, ...MORE_PHOTOS];

export default function Gallery() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const moreButton = useRef<HTMLButtonElement>(null);
  const open = (photo: PhotoData) => setSelected(album.findIndex(item => item.src === photo.src));
  const photoButton = (photo: PhotoData, className = '') => <button key={photo.src} className={`photo-button ${className}`} onClick={() => open(photo)} aria-label={`${photo.alt} 크게 보기`}><Photo photo={photo} /></button>;

  return <>
    <section className="invitation-page portraits" aria-label="우리의 웨딩 사진">
      <div className="portrait-triptych">{PHOTOS.triptych.map(photo => photoButton(photo))}</div>
      {photoButton(PHOTOS.pajamas, 'pajamas-photo')}
    </section>
    <section className="invitation-page gallery" aria-label="사진첩">
      {photoButton(PHOTOS.veil, 'veil-photo')}
      <div className="gallery-grid">{PHOTOS.grid.map((photo, index) => index === 5 && !expanded
        ? <button key={photo.src} ref={moreButton} className="photo-button more-photos" onClick={() => setExpanded(true)} aria-expanded={expanded} aria-controls="extended-gallery"><Photo photo={photo} /><span>더보기</span></button>
        : photoButton(photo))}</div>
    </section>
    {expanded && <div id="extended-gallery" className="extended-gallery"><div className="expanded-grid">{MORE_PHOTOS.map(photo => photoButton(photo))}</div><button className="collapse-gallery" onClick={() => { setExpanded(false); requestAnimationFrame(() => moreButton.current?.focus()); }}>사진 접기</button></div>}
    {selected !== null && <GalleryLightbox photos={album} initialIndex={selected} onClose={() => setSelected(null)} />}
  </>;
}
