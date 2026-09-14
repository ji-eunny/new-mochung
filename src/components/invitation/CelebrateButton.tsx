'use client';

import { useRef, useState } from 'react';

/** 빈티지 무드 이모지 */
const EMOJIS = ['🕊', '💌', '💍', '🕯', '🎀', '🌹', '🥂', '🎻', '🪞', '📜', '🤍', '🥀', '🎗', '🪶', '💐', '✨'];

type Side = 'left' | 'right';

type Particle = {
  id: number;
  side: Side;
  x: number;
  emoji: string;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  rotate: number;
  size: number;
};

/** 하단 좌·우 한 지점에서 위쪽으로 펑 터지는 이모지 한 알 */
function spawnSide(side: Side, nextId: { current: number }) {
  const x = 4 + Math.random() * 8;
  const count = 14 + Math.floor(Math.random() * 6);

  return Array.from({ length: count }, (): Particle => {
    // 위로 높이 튀어오르되, 가운데로 살짝 모이고 양옆으로도 약간 퍼지게(균형).
    const dy = -(380 + Math.random() * 520);
    const towardCenter = (side === 'left' ? 1 : -1) * (55 + Math.random() * 75);
    const spread = (Math.random() - 0.5) * 90;
    const dx = towardCenter + spread;
    return {
      id: nextId.current++,
      side,
      x,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      duration: 850 + Math.random() * 450,
      delay: Math.random() * 60,
      dx,
      dy,
      rotate: (Math.random() - 0.5) * 420,
      size: 18 + Math.random() * 20,
    };
  });
}

export default function CelebrateButton() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);

  const celebrate = () => {
    const batch = [...spawnSide('left', nextId), ...spawnSide('right', nextId)];
    setParticles(prev => [...prev, ...batch]);

    const ids = new Set(batch.map(p => p.id));
    window.setTimeout(() => {
      setParticles(prev => prev.filter(p => !ids.has(p.id)));
    }, 1600);
  };

  return (
    <>
      <button
        type="button"
        onClick={celebrate}
        aria-label="축하 이모지 터뜨리기"
        className="fixed right-16 top-4 z-50 grid h-10 w-10 place-items-center rounded-full bg-white/70 text-neutral-700 shadow-sm backdrop-blur transition-colors hover:bg-white/90"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21C12 21 4 13.8 4 8.6C4 5.6 6.4 4 8.8 5.4C10.2 6.2 12 8 12 8C12 8 13.8 6.2 15.2 5.4C17.6 4 20 5.6 20 8.6C20 13.8 12 21 12 21Z" />
        </svg>
      </button>

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden [clip-path:inset(0_0_36px_0)]">
        {particles.map(p => (
          <span
            key={p.id}
            className={p.side === 'left' ? 'celebrate-burst-left' : 'celebrate-burst-right'}
            style={{
              ...(p.side === 'left' ? { left: `${p.x}%` } : { right: `${p.x}%` }),
              fontSize: `${p.size}px`,
              animationDuration: `${p.duration}ms`,
              animationDelay: `${p.delay}ms`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rotate}deg`,
            } as React.CSSProperties & Record<'--dx' | '--dy' | '--rot', string>}
          >
            {p.emoji}
          </span>
        ))}
      </div>
    </>
  );
}
