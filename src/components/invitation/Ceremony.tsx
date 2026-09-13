import { PHOTOS, WEDDING } from '@/lib/invitation';
import Photo from './Photo';

export default function Ceremony() {
  const query = encodeURIComponent(WEDDING.mapQuery);
  return <section className="invitation-page ceremony" aria-label="혼주와 예식 안내">
    <div className="families"><p>장석균 · 유상아의 <strong>아들 재훈</strong></p><p>김동기 · 현경희의 <strong>딸 지은</strong></p></div>
    <Photo photo={PHOTOS.venue} className="ceremony-photo" />
    <div className="ceremony-details"><p><time dateTime={WEDDING.date}>{WEDDING.dateLabel}</time></p><p className="venue-name">{WEDDING.venue}</p><p className="venue-address">{WEDDING.address}</p>
      <nav className="map-links" aria-label="예식장 지도"><a href={`https://map.naver.com/p/search/${query}`} target="_blank" rel="noopener noreferrer">네이버지도</a><a href={`https://map.kakao.com/?q=${query}`} target="_blank" rel="noopener noreferrer">카카오맵</a></nav>
    </div>
  </section>;
}
