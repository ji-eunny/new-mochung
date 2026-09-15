import { WEDDING } from '@/lib/invitation';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';

/** 3p. 혼주 소개 + 예식 사진 + 일시/장소 + 지도 링크. */
export default function Ceremony() {
  const query = encodeURIComponent(WEDDING.mapQuery);
  const mapLink = 'inline-flex min-h-11 items-center rounded-full border border-neutral-300 px-6 py-2 text-[16px]';

  return (
    <Section aria-label="혼주와 예식 안내" className="gap-12 text-center">
      <Reveal><p className="text-gray-400"><span>*</span> INFORMATION <span>*</span></p></Reveal>
      <Reveal className="text-[14px] leading-[2] mt-2">
        <p>장석균 · 유상아의 아들<strong className="font-bold"> 재훈</strong></p>
        <p className="mt-1">김동기 · 현경희의 딸<strong className="font-bold"> 지은</strong></p>
      </Reveal>

      <Reveal delay={120} className="my-2 w-[72%] max-w-[250px]">
        <Photo
          photo={{ src: '/images/information-photo.png', alt: '데크 위에서 마주한 재훈과 지은' }}
          sizes="250px"
          className="w-full aspect-[1024/682]"
        />
      </Reveal>

      <Reveal delay={120} className="leading-[1.7]">
        <p className="text-[14px] font-bold tracking-tight">{WEDDING.dateLabel}</p>
        <p className="mt-3 text-[14px]">{WEDDING.venue}</p>
        <p className="mt-3 text-[12px] text-neutral-600">{WEDDING.address}</p>
      </Reveal>
    </Section>
  );
}
