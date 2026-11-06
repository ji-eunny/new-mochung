'use client';

import { useState } from 'react';
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

/** 6p. 대표 사진 + 신랑측/신부측 아코디언 계좌 안내. */
export default function Accounts() {
  const [open, setOpen] = useState<Side | null>(null);
  const [message, setMessage] = useState('');

  const toggle = (side: Side) => {
    setOpen(current => (current === side ? null : side));
    setMessage('');
  };

  const copy = async (name: string, number: string) => {
    const copied = await copyText(number);
    setMessage(copied ? `${name}님의 계좌번호가 복사되었습니다.` : '복사하지 못했습니다. 계좌번호를 길게 눌러 복사해 주세요.');
  };

  return (
    <Section aria-labelledby="accounts-heading" className="gap-7">
      <Reveal><p className="text-gray-400"><span>*</span> ACCOUNT <span>*</span></p></Reveal>
      <Reveal className="mt-2 text-center text-[14px] leading-[2] text-neutral-600">
        <p>참석이 어려우신 분들을 위해</p>
        <p>계좌번호를 기재하였습니다.</p>
        <p>너그러운 마음으로 양해 부탁드립니다.</p>
      </Reveal>
      <Reveal delay={120} className="mt-4 w-[70%] max-w-[300px]">
        <Photo photo={PHOTOS.accounts} sizes="70vw" className="aspect-[6/4] w-full [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_28%,#000_72%,transparent_100%)] [mask-image:linear-gradient(to_right,transparent_0%,#000_28%,#000_72%,transparent_100%)]" />
      </Reveal>

      <Reveal delay={200} className="mt-8 w-full max-w-[320px]">
        <div className="flex flex-col gap-3">
          {SIDES.map(({ value, label }) => {
            const isOpen = open === value;
            return (
              <div key={value} className="border-y border-neutral-200">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`account-panel-${value}`}
                  id={`account-tab-${value}`}
                  onClick={() => toggle(value)}
                  className="flex min-h-11 w-full items-center justify-center gap-2 text-[13px] tracking-[0.2em] text-neutral-800"
                >
                  <span>{label}</span>
                  <span
                    aria-hidden
                    className={cn(
                      'text-[10px] text-neutral-400 transition-transform duration-300',
                      isOpen && 'rotate-180',
                    )}
                  >
                    ∨
                  </span>
                </button>

                <div
                  id={`account-panel-${value}`}
                  role="region"
                  aria-labelledby={`account-tab-${value}`}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="pb-4 pt-1">
                      {ACCOUNTS[value].map(account => (
                        <li
                          key={account.name}
                          className="flex items-center justify-between gap-3 px-1 py-3"
                        >
                          <div className="min-w-0 text-left">
                            <p className="text-[13px] text-neutral-700">
                              {account.role} · {account.name}
                            </p>
                            <p className="mt-1 text-[12px] tracking-wide text-neutral-500">
                              {account.bank}
                            </p>
                            <p className="mt-0.5 select-text text-[13px] tracking-tight text-neutral-600">
                              {account.number}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="min-h-9 shrink-0 px-2 text-[12px] tracking-wide text-neutral-500"
                            aria-label={`${account.name} 계좌번호 복사`}
                            onClick={() => copy(account.name, account.number)}
                          >
                            복사
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p role="status" className="mt-3 min-h-[1.5em] text-center text-[12px] text-neutral-500">
          {message}
        </p>
      </Reveal>
    </Section>
  );
}
