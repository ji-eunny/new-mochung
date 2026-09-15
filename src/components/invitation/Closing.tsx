import { assetPath } from '@/lib/asset';
import { PHOTOS } from '@/lib/invitation';
import Section from './Section';
import Reveal from './Reveal';
import ShareButton from './ShareButton';
import ClosingVideo from './ClosingVideo';

/** 7p. 영상(사진) + 마무리 감사 인사. */
export default function Closing() {
  return (
    <Section className="px-0 justify-start">
      <Reveal><p className="text-gray-400"><span>*</span> THANK YOU <span>*</span></p></Reveal>
      <Reveal delay={120} className="relative aspect-[6/3] w-full overflow-hidden mt-16">
        <ClosingVideo
          className="absolute inset-0 h-full w-full object-cover"
          src={assetPath('/images/closing.mov')}
          poster={assetPath(PHOTOS.closing.src)}
          alt={PHOTOS.closing.alt}
        />
      </Reveal>
      <Reveal delay={120} className="text-left text-[14px] leading-[2] mt-24 w-full pl-6">
        <p>소중한 날 함께해 주셔서 감사합니다.</p>
        <p className="mt-4">재훈, 지은 드림</p>
      </Reveal>

      <Reveal delay={200} className="mt-60">
  
          <ShareButton />
 
      </Reveal>

      <Reveal delay={120}>
        <footer className="text-center text-[10px] tracking-wide text-neutral-400 mt-4">
          © 2027 Jieun &amp; Jaehoon. All rights reserved.
        </footer>
      </Reveal>
    </Section>
  );
}
