import Image from 'next/image';
import { PHOTOS } from '@/lib/invitation';
import { assetPath } from '@/lib/asset';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';

/** 2p. 상단 사진 두 장 + 소개글 이미지. */
export default function Greeting() {
  return (
    <Section aria-label="초대의 글" className="gap-12 min-h-[70svh]">
      <Reveal><p className="text-gray-400"><span>*</span> INVITATION <span>*</span></p></Reveal>
      <div className="grid w-full grid-cols-2 gap-1 mt-2">
        <Reveal className="aspect-[4/3] w-full"><Photo photo={PHOTOS.selfie} sizes="45vw" className="h-full w-full" /></Reveal>
        <Reveal delay={140} className="aspect-[4/3] w-full"><Photo photo={PHOTOS.camera} sizes="45vw" className="h-full w-full" /></Reveal>
      </div>
      <Reveal delay={120} className="w-full">
        <Image
          src={assetPath('/images/invitation.png')}
          alt="풋풋했던 스무살의 봄, 서로의 첫사랑이 된 우리는 아홉 번의 사계절을 지나 평생의 연인이 되려 합니다. 오랜 시간 기다려온 저희의 순간에 따뜻한 축하를 보내주시면 감사하겠습니다."
          width={1024}
          height={1536}
          sizes="(max-width: 480px) 100vw, 480px"
          className="mx-auto h-auto w-full max-w-[360px] origin-center rotate-4"
          priority={false}
        />
      </Reveal>
    </Section>
  );
}
