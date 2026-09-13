'use client';

import { useRef, useState } from 'react';
import { ACCOUNTS, PHOTOS } from '@/lib/invitation';
import { copyText } from '@/lib/clipboard';
import Photo from './Photo';

type Side = keyof typeof ACCOUNTS;
export default function Accounts() {
  const [side, setSide] = useState<Side>('bride');
  const [message, setMessage] = useState('');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return <section className="invitation-page accounts" aria-labelledby="accounts-heading">
    <Photo photo={PHOTOS.accounts} className="accounts-photo" />
    <div className="accounts-content"><h2 id="accounts-heading">계좌정보</h2>
      <div className="account-tabs" role="tablist" aria-label="계좌 선택">{(['groom', 'bride'] as const).map((value, index) => <button key={value} ref={node => { tabs.current[index] = node; }} role="tab" id={`tab-${value}`} aria-selected={side === value} aria-controls={`panel-${value}`} tabIndex={side === value ? 0 : -1} onClick={() => { setSide(value); setMessage(''); }} onKeyDown={event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
        setSide(next === 0 ? 'groom' : 'bride'); setMessage(''); tabs.current[next]?.focus();
      }}>{value === 'groom' ? '신랑측' : '신부측'}</button>)}</div>
      <div role="tabpanel" id={`panel-${side}`} aria-labelledby={`tab-${side}`} className="account-rows">{ACCOUNTS[side].map(account => <div className="account-row" key={account.name}><p className="account-owner">{account.role} | {account.name}</p><div className="account-bank"><span>{account.bank}</span><span className="account-number">{account.number}</span></div><button className="copy-account" aria-label={`${account.name} 계좌번호 복사`} onClick={async () => { const copied = await copyText(account.number); setMessage(copied ? `${account.name}님의 계좌번호가 복사되었습니다.` : '복사하지 못했습니다. 계좌번호를 길게 눌러 복사해 주세요.'); }}>복사</button></div>)}</div>
      <p className="copy-status" role="status">{message}</p>
    </div>
  </section>;
}
