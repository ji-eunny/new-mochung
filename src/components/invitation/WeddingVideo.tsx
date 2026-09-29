import { assetPath } from '@/lib/asset';
import Section from './Section';
import Reveal from './Reveal';
import ClosingVideo from './ClosingVideo';

/** INFORMATION ↔ WEDDING DAY. 타이틀 없이 영상만. */
export default function WeddingVideo() {
  return (
    <Section aria-label="웨딩 영상" className="min-h-0 justify-center gap-0 px-0 pb-10 pt-0">
      <Reveal className="w-full">
        <ClosingVideo
          className="block h-auto w-full"
          src={assetPath('/images/wedding.MOV')}
          alt="재훈과 지은의 웨딩 영상"
        />
      </Reveal>
    </Section>
  );
}
