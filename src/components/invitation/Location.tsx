import { WEDDING } from '@/lib/invitation';
import Section from './Section';
import Reveal from './Reveal';

const mapLink = 'inline-flex min-h-11 items-center rounded-full border border-neutral-300 px-6 py-2 text-[14px]';

/** ACCOUNTS 위. 예식장 위치·지도. */
export default function Location() {
  const query = encodeURIComponent(WEDDING.mapQuery);

  return (
    <Section aria-label="예식장 오시는 길" className="gap-9 text-center min-h-[60svh]">
      <Reveal>
        <p className="text-gray-400"><span>*</span> LOCATION <span>*</span></p>
      </Reveal>

      <Reveal delay={120} className="w-full py-4">
        <div className="mx-auto w-full max-w-[320px] text-center">
          <p className="text-[20px] tracking-wide text-neutral-800">{WEDDING.venue}</p>
          <p className="mt-4 text-[13px] leading-[1.9] text-neutral-600">{WEDDING.address}</p>
          <p className="mt-5 text-[12px] tracking-wide text-neutral-500">{WEDDING.directions}</p>
        </div>
      </Reveal>

      <Reveal delay={200} className="w-full">
        <nav className="mx-auto flex w-fit gap-4" aria-label="예식장 지도">
          <a className={mapLink} href={`https://map.naver.com/p/search/${query}`} target="_blank" rel="noopener noreferrer">네이버지도</a>
          <a className={mapLink} href={`https://map.kakao.com/?q=${query}`} target="_blank" rel="noopener noreferrer">카카오맵</a>
        </nav>
      </Reveal>
    </Section>
  );
}
