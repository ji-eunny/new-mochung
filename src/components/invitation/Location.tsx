import { WEDDING } from '@/lib/invitation';
import Section from './Section';
import Reveal from './Reveal';

const mapLink = 'inline-flex min-h-11 items-center rounded-full border border-neutral-300 px-6 py-2 text-[16px]';

/** ACCOUNTS 위. 예식장 위치·지도·오시는 길. */
export default function Location() {
  const query = encodeURIComponent(WEDDING.mapQuery);
  const { lat, lng } = WEDDING.coordinates;
  // staticmap.openstreetmap.de 는 서비스 종료 → OSM embed iframe 사용
  const pad = 0.012;
  const mapEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - pad},${lat - pad * 0.75},${lng + pad},${lat + pad * 0.75}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <Section aria-label="예식장 오시는 길" className="gap-9 text-center min-h-[60svh]">
      <Reveal>
        <p className="text-gray-400"><span>*</span> LOCATION <span>*</span></p>
      </Reveal>

      <Reveal delay={120} className="w-full max-w-[320px] py-8">
        <p className="font-['Times_New_Roman',Times,serif] text-[22px] tracking-wide text-neutral-800">{WEDDING.venue}</p>
        <p className="mt-4 text-[15px] leading-[1.9] text-neutral-600">{WEDDING.address}</p>
        <p className="mt-5 text-[14px] tracking-wide text-neutral-500">{WEDDING.directions}</p>
        <p className="mt-5 text-[14px] tracking-wide text-neutral-500">주차 : {WEDDING.parking}</p>
      </Reveal>


      <Reveal delay={280}>
        <nav className="flex gap-4" aria-label="예식장 지도">
          <a className={mapLink} href={`https://map.naver.com/p/search/${query}`} target="_blank" rel="noopener noreferrer">네이버지도</a>
          <a className={mapLink} href={`https://map.kakao.com/?q=${query}`} target="_blank" rel="noopener noreferrer">카카오맵</a>
        </nav>
      </Reveal>

    </Section>
  );
}
