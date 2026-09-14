import Cover from '@/components/invitation/Cover';
import Greeting from '@/components/invitation/Greeting';
import Ceremony from '@/components/invitation/Ceremony';
import WeddingDay from '@/components/invitation/WeddingDay';
import Portraits from '@/components/invitation/Portraits';
import Gallery from '@/components/invitation/Gallery';
import Location from '@/components/invitation/Location';
import Accounts from '@/components/invitation/Accounts';
import Closing from '@/components/invitation/Closing';

/** PDF 한 장 = 한 섹션. 각 섹션은 모바일 화면을 세로로 꽉 채운다. */
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[480px]">
      <Cover />
      <Greeting />
      <Ceremony />
      <WeddingDay />
      <Portraits />
      <Gallery />
      <Location />
      <Accounts />
      <Closing />
    </main>
  );
}
