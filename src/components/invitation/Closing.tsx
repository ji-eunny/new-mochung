import { PHOTOS } from '@/lib/invitation';
import Photo from './Photo';

export default function Closing() {
  return <footer className="invitation-page closing"><Photo photo={PHOTOS.closing} className="closing-photo" /><div className="closing-message"><p>소중한 날, 함께해 주셔서 감사합니다.</p><p>지은, 재훈 드림</p></div></footer>;
}
