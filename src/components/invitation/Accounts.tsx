'use client';

import { useRef, useState } from 'react';
import { ACCOUNTS, PHOTOS } from '@/lib/invitation';
import { copyText } from '@/lib/clipboard';
import { cn } from '@/lib/utils';
import Photo from './Photo';
import Section from './Section';
import Reveal from './Reveal';

type Side = keyof typeof ACCOUNTS;
const SIDES: { value: Side; label: string }[] = [
  { value: 'groom', label: '신랑측' },
  { value: 'bride', label: '신부측' },
];

/** 6p. 대표 사진 + 신랑측/신부측 탭으로 계좌 안내(복사 버튼). */
export default function Accounts() {
  const [side, setSide] = useState<Side>('groom');
  const [message, setMessage] = useState('');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyNav = (event: React.KeyboardEvent, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
    setSide(SIDES[next].value);
    setMessage('');
    tabs.current[next]?.focus();
  };

  const copy = async (name: string, number: string) => {
    const copied = await copyText(number);
    setMessage(copied ? `${name}님의 계좌번호가 복사되었습니다.` : '복사하지 못했습니다. 계좌번호를 길게 눌러 복사해 주세요.');
  };

  return (
    <Section aria-labelledby="accounts-heading" className="gap-7">
      <Reveal><p className="text-gray-400"><span>*</span> ACCOUNT <span>*</span></p></Reveal>
      <Reveal delay={120} className="mt-4 w-[70%] max-w-[300px]">
        <Photo photo={PHOTOS.accounts} sizes="70vw" className="aspect-[6/4] w-full [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_28%,#000_72%,transparent_100%)] [mask-image:linear-gradient(to_right,transparent_0%,#000_28%,#000_72%,transparent_100%)]" />
      </Reveal>

      <div className="w-full max-w-[360px] mt-4">

        <Reveal role="tablist" aria-label="계좌 선택" delay={240} className="mt-3 grid grid-cols-2">
          {SIDES.map(({ value, label }, index) => (
            <button
              key={value}
              ref={node => { tabs.current[index] = node; }}
              role="tab"
              id={`tab-${value}`}
              aria-selected={side === value}
              aria-controls={`panel-${value}`}
              tabIndex={side === value ? 0 : -1}
              onClick={() => { setSide(value); setMessage(''); }}
              onKeyDown={event => onKeyNav(event, index)}
              className={cn(
                'min-h-11 border-b-2 pb-2 text-[18px] transition-colors',
                side === value ? 'border-[#6c5c60] text-neutral-900' : 'border-neutral-200 text-neutral-400',
              )}
            >
              {label}
            </button>
          ))}
        </Reveal>

        <Reveal role="tabpanel" id={`panel-${side}`} aria-labelledby={`tab-${side}`} delay={320} className="divide-y divide-neutral-100">
          {ACCOUNTS[side].map(account => (
            <div key={account.name} className="grid grid-cols-[1fr_auto] items-center gap-3 py-6">
              <div className="min-w-0">
                <p className="text-[17px]">{account.role} | {account.name}</p>
                <p className="mt-1 text-[14px] text-neutral-500">{account.bank}</p>
                <p className="select-text text-[17px] tracking-tight">{account.number}</p>
              </div>
              <button
                className="min-h-11 shrink-0 rounded-full border border-neutral-300 px-4 text-[15px]"
                aria-label={`${account.name} 계좌번호 복사`}
                onClick={() => copy(account.name, account.number)}
              >
                복사
              </button>
            </div>
          ))}
        </Reveal>

        <p role="status" className="mt-3 min-h-[2em] text-center text-[14px] leading-[1.7] text-neutral-500">{message}</p>
      </div>
    </Section>
  );
}
