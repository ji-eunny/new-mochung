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
  cover: { src: '/images/complete/IMG_5369.JPG', alt: '서로를 바라보는 재훈과 지은' },
  selfie: { src: '/images/img6.jpg', alt: '초록 나무 앞에서 함께 셀카를 찍는 두 사람' },
  camera: { src: '/images/img7.jpg', alt: '베일을 펼친 지은을 사진에 담는 재훈' },
  venue: { src: '/images/reference/venue-photo.png', alt: '나란히 누워 쉬고 있는 두 사람' },
  triptych: [
    { src: '/images/reference/triptych-1.webp', alt: '꽃다발을 들고 가까이 마주한 두 사람' },
    { src: '/images/reference/triptych-2.webp', alt: '함께 브이 포즈를 하는 재훈과 지은' },
    { src: '/images/02.jpg', alt: '다정하게 나란히 선 두 사람' },
  ],
  pajamas: { src: '/images/reference/pajamas.webp', alt: '잠옷을 입고 도넛을 즐기는 두 사람' },
  /** 앨범(Gallery) 대표 사진 */
  veil: { src: '/images/complete/IMG_5322-2.JPG', alt: '재훈과 지은의 웨딩 사진', position: '50% 50%' },
  grid: [
    { src: '/images/complete/IMG_5260-2.JPG', alt: '재훈과 지은의 웨딩 사진 1' },
    { src: '/images/complete/IMG_5380.JPG', alt: '재훈과 지은의 웨딩 사진 2' },
    { src: '/images/complete/IMG_5324-3.JPG', alt: '재훈과 지은의 웨딩 사진 3' },
    { src: '/images/complete/IMG_5381.JPG', alt: '재훈과 지은의 웨딩 사진 4' },
    { src: '/images/complete/IMG_5273-3.JPG', alt: '재훈과 지은의 웨딩 사진 5' },
    { src: '/images/complete/IMG_5374.JPG', alt: '재훈과 지은의 웨딩 사진 6' },
  ],
  accounts: { src: '/images/DSC00451.JPG', alt: '반지를 보여주며 활짝 웃는 재훈과 지은' },
  closing: { src: '/images/reference/closing.webp', alt: '손을 잡고 감사 인사를 하는 두 사람' },
} satisfies Record<string, Photo | Photo[]>;

/** 앨범 라이트박스 — 다른 섹션·Portraits에서 쓰는 사진은 제외. 5000번대 → 3000번대 */
export const ALBUM_PHOTOS: Photo[] = [
  // 5000번대
  { src: '/images/complete/IMG_5085-2.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5260-2.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5263-2.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5264-2.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5266-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5268-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5269-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5270-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5271-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5272-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5273-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5274-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5276-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5277-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5278-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5279-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5280-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5281-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5283-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5322-2.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5322-2-2.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5323-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5324-3.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5368.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5371.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5372.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5373.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5374.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5375.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5376.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5377.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5378.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5380.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5381.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5382.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5383.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5384.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5385.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5386.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5387.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5388.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_5389.JPG', alt: '재훈과 지은의 웨딩 사진' },
  // 3000번대
  { src: '/images/complete/IMG_3744.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3745.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3746.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3748-2.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3752.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3753.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3758.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3759.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3767.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3768.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3773.JPG', alt: '재훈과 지은의 웨딩 사진' },
  { src: '/images/complete/IMG_3777.JPG', alt: '재훈과 지은의 웨딩 사진' },
];
