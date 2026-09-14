'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';
import { copyText } from '@/lib/clipboard';

/**
 * 청첩장 링크 공유.
 * 1) Web Share API(HTTPS 모바일) → 시스템 공유 시트
 * 2) 클립보드 복사(비보안 HTTP·iOS 폴백 포함)
 * 3) 그래도 실패하면 링크를 화면에 노출해 길게 눌러 복사하도록 안내
 */
export default function ShareButton() {
  const [message, setMessage] = useState('');
  const [showLink, setShowLink] = useState(false);

  const share = async () => {
    const url = SITE.url;

    // 1) 네이티브 공유 (HTTPS 보안 컨텍스트에서만 제공됨)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: SITE.title, text: SITE.description, url });
        return;
      } catch (error) {
        // 사용자가 취소한 경우엔 조용히 종료
        if (error instanceof Error && error.name === 'AbortError') return;
        // 그 외 실패 → 복사로 폴백
      }
    }

    // 2) 클립보드 복사
    const copied = await copyText(url);
    if (copied) {
      setShowLink(false);
      setMessage('청첩장 링크가 복사되었습니다.');
      return;
    }

    // 3) 최종 폴백: 링크 노출(길게 눌러 복사)
    setShowLink(true);
    setMessage('아래 링크를 길게 눌러 복사해 주세요.');
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-11 items-center rounded-full border border-neutral-300 px-6 text-[15px] text-neutral-700"
      >
        청첩장 공유하기
      </button>
      <p role="status" aria-live="polite" className="min-h-[1.5em] text-[13px] text-neutral-500">{message}</p>
      {showLink && (
        <a href={SITE.url} className="max-w-[80vw] select-all break-all text-center text-[13px] text-neutral-700 underline">
          {SITE.url}
        </a>
      )}
    </div>
  );
}
