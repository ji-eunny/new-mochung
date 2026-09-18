import { PHOTOS } from '@/lib/invitation';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';

/** 2p. 상단 사진 두 장 + 손글씨 인사말. */
export default function Greeting() {
  return (
    <Section aria-label="초대의 글" className="gap-12 min-h-[70svh]">
      <Reveal><p className="text-gray-400"><span>*</span> INVITATION <span>*</span></p></Reveal>
      <div className="grid w-full grid-cols-2 gap-1 mt-2">
        <Reveal className="aspect-[4/3] w-full"><Photo photo={PHOTOS.selfie} sizes="45vw" className="h-full w-full" /></Reveal>
        <Reveal delay={140} className="aspect-[4/3] w-full"><Photo photo={PHOTOS.camera} sizes="45vw" className="h-full w-full" /></Reveal>
      </div>
      <Reveal delay={120} className="mt-8">
        <p className="text-left font-['GaramYeonGeot',cursive] text-[22px] leading-[2.1] text-neutral-700 font-bold">
          풋풋했던 스무살의 봄,<br />
          서로의 첫사랑이 된 우리는<br />
          아홉 번의 사계절을 지나<br className="hidden max-[350px]:inline" /> 평생의 연인이 되려 합니다.
          <br /><br />
          오랜 시간 기다려온 저희의 순간에<br />
          따뜻한 축하를 보내주시면 감사하겠습니다.
        </p>
      </Reveal>
    </Section>
  );
}
