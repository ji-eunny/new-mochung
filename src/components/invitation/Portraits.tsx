import { PHOTOS } from '@/lib/invitation';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';

// triptych = [꽃다발, 브이포즈, 나란히 선 커플]
const [, vPose, standing] = PHOTOS.triptych;

/** 4p. 사진 세 장을 엇갈리게 배치한 콜라주(좌상 · 우하 · 하단중앙). */
export default function Portraits() {
  return (
    <Section aria-label="우리의 웨딩 사진" className="px-5">
      <Reveal><p className="text-gray-400 mt-[-16px]"><span>*</span> PHOTOS <span>*</span></p></Reveal>
      <div className="relative mx-auto mt-12 aspect-[2/3] w-full max-w-[420px]">
        <Reveal className="absolute left-[7%] top-[3%] aspect-[2/3] w-[40%]">
          <Photo photo={vPose} sizes="40vw" className="h-full w-full" />
        </Reveal>
        <Reveal delay={160} className="absolute left-[56%] top-[14%] aspect-[2/3] w-[40%]">
          <Photo photo={standing} sizes="40vw" className="h-full w-full" />
        </Reveal>
        <Reveal delay={320} className="absolute left-[20%] top-[60%] aspect-[2/3] w-[60%]">
          <Photo photo={PHOTOS.pajamas} sizes="45vw" className="h-full w-full" />
        </Reveal>
      </div>
    </Section>
  );
}
