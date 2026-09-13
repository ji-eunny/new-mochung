import Image from 'next/image';
import { PHOTOS } from '@/lib/invitation';
import Photo from './Photo';

export default function Greeting() {
  return <section className="invitation-page greeting" aria-label="초대의 글">
    <div className="greeting-pair"><Photo photo={PHOTOS.selfie} /><Photo photo={PHOTOS.camera} /></div>
    <div className="handwritten-message"><Image src="/images/reference/handwritten-message.png" alt="풋풋했던 스무살의 봄, 서로의 첫사랑이 된 우리는 아홉 번의 사계절을 지나 평생의 연인이 되려 합니다. 오랜 시간 기다려온 저희의 순간에 따뜻한 축하를 보내주시면 감사하겠습니다." width={770} height={450} /></div>
  </section>;
}
