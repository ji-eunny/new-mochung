/** Edit invitation content here. Account numbers are the PDF's sample values. */
import { ALBUM_FILES } from './album.generated';

export const WEDDING = {
  date: '2027-02-13T10:50:00+09:00',
  dateLabel: '2027년 2월 13일 토요일 오전 10시 50분',
  venue: '까사그랑데 센트로',
  address: '서울 광진구 능동로 87 건대입구역 자이엘라 6층',
  mapQuery: '까사그랑데 센트로 서울 광진구 능동로 87',
  /** LOCATION 섹션 지도·오시는 길 */
  coordinates: { lat: 37.5414, lng: 127.0699 },
  directions: '2호선 · 7호선 건대입구역 5번 출구 도보 1분',
  parking: '건물 내 B2~B5 / 외부 주차장',
};

export type Account = { role: string; name: string; bank: string; number: string };
export const ACCOUNTS: Record<'groom' | 'bride', Account[]> = {
  groom: [
    { role: '신랑', name: '장재훈', bank: '카카오뱅크', number: '1234-1234-1234' },
    { role: '아버지', name: '장석균', bank: '카카오뱅크', number: '1234-1234-1234' },
    { role: '어머니', name: '유상아', bank: '카카오뱅크', number: '1234-1234-1234' },
  ],
  bride: [
    { role: '신부', name: '김지은', bank: '카카오뱅크', number: '1234-1234-1234' },
    { role: '아버지', name: '김동기', bank: '카카오뱅크', number: '1234-1234-1234' },
    { role: '어머니', name: '현경희', bank: '카카오뱅크', number: '1234-1234-1234' },
  ],
};

export type Photo = { src: string; alt: string; position?: string };

/** `public/images/complete/{n}.JPG` — 파일 숫자 = 앨범 순서 */
export function photo(n: number, alt = '재훈과 지은의 웨딩 사진', position?: string): Photo {
  return { src: `/images/complete/${n}.JPG`, alt, ...(position ? { position } : {}) };
}

export const PHOTOS = {
  cover: photo(2, '서로를 바라보는 재훈과 지은'),
  selfie: { src: '/images/img6.jpg', alt: '초록 나무 앞에서 함께 셀카를 찍는 두 사람' },
  camera: { src: '/images/img7.jpg', alt: '베일을 펼친 지은을 사진에 담는 재훈' },
  venue: { src: '/images/reference/venue-photo.png', alt: '나란히 누워 쉬고 있는 두 사람' },
  ceremony: photo(27, '데크 위에서 마주한 재훈과 지은'),
  portraits: [photo(4), photo(6), photo(34)],
  triptych: [
    { src: '/images/reference/triptych-1.webp', alt: '꽃다발을 들고 가까이 마주한 두 사람' },
    { src: '/images/reference/triptych-2.webp', alt: '함께 브이 포즈를 하는 재훈과 지은' },
    { src: '/images/02.jpg', alt: '다정하게 나란히 선 두 사람' },
  ],
  pajamas: { src: '/images/reference/pajamas.webp', alt: '잠옷을 입고 도넛을 즐기는 두 사람' },
  /** 앨범(Gallery) 대표 사진 — 라이트박스에서는 제외 */
  veil: photo(9, '재훈과 지은의 웨딩 사진', '20% 20%'),
  grid: [photo(29), photo(23), photo(16), photo(25), photo(24), photo(31)],
  accounts: { src: '/images/DSC00451.JPG', alt: '반지를 보여주며 활짝 웃는 재훈과 지은' },
  closing: { src: '/images/reference/closing.webp', alt: '손을 잡고 감사 인사를 하는 두 사람' },
  /** 카톡·SNS 공유 썸네일 — 라이트박스에서는 제외 */
  share: photo(4),
} satisfies Record<string, Photo | Photo[]>;

/** Cover / Ceremony / Portraits / Gallery / 공유에 쓰인 사진은 앨범에서 제외 */
const SECTION_PHOTO_SRCS = new Set(
  Object.values(PHOTOS).flatMap(value => (Array.isArray(value) ? value : [value]).map(p => p.src)),
);

/** 앨범에서만 추가로 숨길 번호 */
const ALBUM_EXCLUDE_SRCS = new Set([photo(29).src]);

/** 앨범 라이트박스 — 섹션 사용분·추가 제외, 숫자 오름차순 (`npm run sync:album`) */
export const ALBUM_PHOTOS: Photo[] = ALBUM_FILES
  .map(file => ({ src: `/images/complete/${file}`, alt: '재훈과 지은의 웨딩 사진' }))
  .filter(p => !SECTION_PHOTO_SRCS.has(p.src) && !ALBUM_EXCLUDE_SRCS.has(p.src));
