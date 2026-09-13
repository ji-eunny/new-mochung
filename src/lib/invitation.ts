/** Edit invitation content here. Account numbers are the PDF's sample values. */
export const WEDDING = {
  date: '2027-02-13T10:50:00+09:00',
  dateLabel: '2027년 2월 13일 토요일 오전 10시 50분',
  venue: '까사그랑데 센트로',
  address: '서울 광진구 능동로 87 건대입구역자이엘라 6층',
  mapQuery: '까사그랑데 센트로 서울 광진구 능동로 87',
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
  veil: { src: '/images/09.jpg', alt: '푸른 하늘 아래 베일 속에서 마주한 두 사람', position: '50% 65%' },
  grid: [
    { src: '/images/reference/blue-dress.webp', alt: '푸른 드레스를 입은 지은' },
    { src: '/images/reference/mirror-heart.webp', alt: '거울 앞에 하트를 그리는 재훈과 지은' },
    { src: '/images/reference/garden-kiss.webp', alt: '초록 담장 아래 다정한 입맞춤' },
    { src: '/images/img5.jpg', alt: '비눗방울 속에서 웃는 두 사람' },
    { src: '/images/img8.jpg', alt: '잔디밭에 앉아 손을 든 두 사람' },
    { src: '/images/img3.jpg', alt: '노을 아래 손을 맞잡은 두 사람' },
  ],
  accounts: { src: '/images/img2.jpg', alt: '반지를 보여주며 활짝 웃는 재훈과 지은' },
  closing: { src: '/images/reference/closing.webp', alt: '손을 잡고 감사 인사를 하는 두 사람' },
} satisfies Record<string, Photo | Photo[]>;

export const MORE_PHOTOS: Photo[] = [
  ...Array.from({ length: 25 }, (_, i) => ({ src: `/images/${String(i + 1).padStart(2, '0')}.jpg`, alt: `재훈과 지은의 웨딩 사진 ${i + 1}` })),
  ...Array.from({ length: 14 }, (_, i) => ({ src: `/images/img${i + 1}.jpg`, alt: `재훈과 지은의 야외 사진 ${i + 1}` })),
].filter(photo => ![...PHOTOS.triptych, ...PHOTOS.grid, PHOTOS.veil].some(shown => shown.src === photo.src));
