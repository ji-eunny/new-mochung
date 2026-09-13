import { PHOTOS } from '@/lib/invitation';
import Photo from './Photo';

export default function Cover() {
  return <section className="invitation-page cover" aria-label="재훈과 지은의 결혼식">
    <Photo photo={PHOTOS.cover} className="cover-photo" priority />
    <h1 className="cover-names"><span className="groom-name">JAEHOON</span><span className="bride-name">JIEUN</span></h1>
    <time className="cover-date" dateTime="2027-02-13">2027. Feb. 13</time>
  </section>;
}
