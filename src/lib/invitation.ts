/** Edit invitation content here. Account numbers are the PDF's sample values. */
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
export const PHOTOS = {
  cover: { src: '/images/01.jpg', alt: '서로를 바라보는 재훈과 지은' },
  selfie: { src: '/images/img6.jpg', alt: '초록 나무 앞에서 함께 셀카를 찍는 두 사람' },
  camera: { src: '/images/img7.jpg', alt: '베일을 펼친 지은을 사진에 담는 재훈' },
  venue: { src: '/images/reference/venue-photo.png', alt: '나란히 누워 쉬고 있는 두 사람' },
  triptych: [
    { src: '/images/reference/triptych-1.webp', alt: '꽃다발을 들고 가까이 마주한 두 사람' },
    { src: '/images/reference/triptych-2.webp', alt: '함께 브이 포즈를 하는 재훈과 지은' },
    { src: '/images/02.jpg', alt: '다정하게 나란히 선 두 사람' },
  ],
  pajamas: { src: '/images/reference/pajamas.webp', alt: '잠옷을 입고 도넛을 즐기는 두 사람' },
  /** 앨범(Gallery) 대표·그리드 — complete 폴더 */
  veil: { src: '/images/complete/IMG_3744.JPG', alt: '재훈과 지은의 웨딩 사진', position: '50% 50%' },
  grid: [
    { src: '/images/complete/IMG_3745.JPG', alt: '재훈과 지은의 웨딩 사진 1' },
    { src: '/images/complete/IMG_3746.JPG', alt: '재훈과 지은의 웨딩 사진 2' },
    { src: '/images/complete/IMG_3748-2.JPG', alt: '재훈과 지은의 웨딩 사진 3' },
    { src: '/images/complete/IMG_3751.JPG', alt: '재훈과 지은의 웨딩 사진 4' },
    { src: '/images/complete/IMG_3752.JPG', alt: '재훈과 지은의 웨딩 사진 5' },
    { src: '/images/complete/IMG_3753.JPG', alt: '재훈과 지은의 웨딩 사진 6' },
  ],
  accounts: { src: '/images/DSC00451.JPG', alt: '반지를 보여주며 활짝 웃는 재훈과 지은' },
  closing: { src: '/images/reference/closing.webp', alt: '손을 잡고 감사 인사를 하는 두 사람' },
} satisfies Record<string, Photo | Photo[]>;

/** 앨범 라이트박스 — complete 폴더 전체 */
export const ALBUM_PHOTOS: Photo[] = [
  { src: '/images/complete/IMG_3744.JPG', alt: '재훈과 지은의 웨딩 사진 1' },
  { src: '/images/complete/IMG_3745.JPG', alt: '재훈과 지은의 웨딩 사진 2' },
  { src: '/images/complete/IMG_3746.JPG', alt: '재훈과 지은의 웨딩 사진 3' },
  { src: '/images/complete/IMG_3748-2.JPG', alt: '재훈과 지은의 웨딩 사진 4' },
  { src: '/images/complete/IMG_3751.JPG', alt: '재훈과 지은의 웨딩 사진 5' },
  { src: '/images/complete/IMG_3752.JPG', alt: '재훈과 지은의 웨딩 사진 6' },
  { src: '/images/complete/IMG_3753.JPG', alt: '재훈과 지은의 웨딩 사진 7' },
  { src: '/images/complete/IMG_3758.JPG', alt: '재훈과 지은의 웨딩 사진 8' },
  { src: '/images/complete/IMG_3759.JPG', alt: '재훈과 지은의 웨딩 사진 9' },
  { src: '/images/complete/IMG_3767.JPG', alt: '재훈과 지은의 웨딩 사진 10' },
  { src: '/images/complete/IMG_3768.JPG', alt: '재훈과 지은의 웨딩 사진 11' },
  { src: '/images/complete/IMG_3773.JPG', alt: '재훈과 지은의 웨딩 사진 12' },
  { src: '/images/complete/IMG_3777.JPG', alt: '재훈과 지은의 웨딩 사진 13' },
  { src: '/images/complete/IMG_5085-2.JPG', alt: '재훈과 지은의 웨딩 사진 14' },
  { src: '/images/complete/IMG_5259-2.JPG', alt: '재훈과 지은의 웨딩 사진 15' },
  { src: '/images/complete/IMG_5260-2.JPG', alt: '재훈과 지은의 웨딩 사진 16' },
  { src: '/images/complete/IMG_5262-2.JPG', alt: '재훈과 지은의 웨딩 사진 17' },
  { src: '/images/complete/IMG_5263-2.JPG', alt: '재훈과 지은의 웨딩 사진 18' },
  { src: '/images/complete/IMG_5264-2.JPG', alt: '재훈과 지은의 웨딩 사진 19' },
  { src: '/images/complete/IMG_5322-2.JPG', alt: '재훈과 지은의 웨딩 사진 20' },
];
