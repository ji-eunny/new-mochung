import { PHOTOS } from '@/lib/invitation';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';
import BgmToggle from './BgmToggle';
import CelebrateButton from './CelebrateButton';

const serif = "font-['Times_New_Roman',Times,serif]";

/** 1p. 세로 사진 위에 신랑·신부 영문 이름을 겹치고, 하단에 예식일을 둔다. */
export default function Cover() {
  return (
    <Section aria-label="재훈과 지은의 결혼식" className="relative">
      <BgmToggle />
      <CelebrateButton />
      <Reveal className="relative aspect-[3/4] w-[70%] max-w-[300px]">
        <Photo photo={PHOTOS.cover} priority sizes="70vw" className="h-full w-full" />
        <span className={`${serif} absolute -left-10 top-[-2%] -translate-y-1/2 text-[52px] font-normal leading-none tracking-tight`}>JAEHOON</span>
        <span className={`${serif} absolute -right-7 bottom-[-2%] translate-y-1/2 text-[52px] font-normal leading-none tracking-tight`}>JIEUN</span>
      </Reveal>
      <Reveal delay={220} className="absolute inset-x-0 bottom-[7svh] text-center">
        <time dateTime="2027-02-13" className={`${serif} text-[20px]`}>2027.&nbsp;  Feb. 13</time>
      </Reveal>
    </Section>
  );
}
