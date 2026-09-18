import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';

const PORTRAIT_PHOTOS = [
  { src: '/images/complete/IMG_5370.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5259-2.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5265-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
] as const;

/** 4p. 사진 세 장을 엇갈리게 배치한 콜라주(좌상 · 우하 · 하단중앙). */
export default function Portraits() {
  const [left, right, bottom] = PORTRAIT_PHOTOS;

  return (
    <Section aria-label="우리의 웨딩 사진" className="px-5">
      <Reveal><p className="text-gray-400 mt-[-16px]"><span>*</span> PHOTOS <span>*</span></p></Reveal>
      <div className="relative mx-auto mt-12 aspect-[2/3] w-full max-w-[420px]">
        <Reveal className="absolute left-[7%] top-[3%] aspect-[2/3] w-[40%]">
          <Photo photo={left} sizes="40vw" className="h-full w-full" />
        </Reveal>
        <Reveal delay={160} className="absolute left-[56%] top-[14%] aspect-[2/3] w-[40%]">
          <Photo photo={right} sizes="40vw" className="h-full w-full" />
        </Reveal>
        <Reveal delay={320} className="absolute left-[20%] top-[60%] aspect-[2/3] w-[60%]">
          <Photo photo={bottom} sizes="45vw" className="h-full w-full" />
        </Reveal>
      </div>
    </Section>
  );
}
