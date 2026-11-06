import { PHOTOS, WEDDING } from '@/lib/invitation';
import { assetPath } from '@/lib/asset';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';
import SoftBreak from './SoftBreak';

/** 3p. 혼주 소개 + 예식 사진 + 일시/장소. */
export default function Ceremony() {
  return (
    <Section aria-label="혼주와 예식 안내" className="gap-12 text-center min-h-[80svh]">
      <Reveal><p className="text-gray-400 text-[18px]"><span>*</span> INFORMATION <span>*</span></p></Reveal>
      <Reveal className="text-[16px] leading-[2] mt-2">
        <p>장석균 · 유상아의 아들<strong className="font-bold"> 재훈</strong></p>
        <p className="mt-1">김동기 · 현경희의 딸<strong className="font-bold"> 지은</strong></p>
      </Reveal>

      <Reveal delay={120} className="relative my-2 w-[72%] max-w-[250px]">
        <div className="relative aspect-[1024/682] w-full">
          <Photo
            photo={PHOTOS.ceremony}
            sizes="250px"
            className="h-full w-full"
          />
          <img
            src={assetPath('/images/vintage.png')}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 h-full w-full object-fill brightness-0 invert"
          />
        </div>
      </Reveal>

      <Reveal delay={120} className="w-full min-w-0 leading-[1.7]">
        <SoftBreak text={WEDDING.dateLabel} className="text-[16px] font-bold tracking-tight" />
        <p className="mt-3 text-[16px]">{WEDDING.venue}</p>
        <SoftBreak text={WEDDING.address} className="mt-3 text-[14px] text-neutral-600" />
      </Reveal>
    </Section>
  );
}
