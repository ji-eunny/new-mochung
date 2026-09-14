import { WEDDING } from '@/lib/invitation';
import { cn } from '@/lib/utils';
import Section from './Section';
import Reveal from './Reveal';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * INFORMATION 다음에 오는 예식일 달력 섹션.
 * WEDDING.date(ISO)에서 연·월·일을 파싱해 해당 월 달력을 그리고 예식일을 강조한다.
 * (타임존 영향을 피하려고 날짜 문자열 앞 10자리 'YYYY-MM-DD'만 사용) */
export default function WeddingDay() {
  const [year, month, day] = WEDDING.date.slice(0, 10).split('-').map(Number);
  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0=일
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Section aria-label="예식일 달력" className="gap-9 min-h-[70svh]">
      <Reveal>
        <p className="text-gray-400"><span>*</span> WEDDING DAY <span>*</span></p>
      </Reveal>

      <Reveal delay={120} className="text-center">
        <p className="font-['Times_New_Roman',Times,serif] text-[46px] leading-none tracking-tight text-neutral-800">
          {String(month).padStart(2, '0')}
          <span className="mx-1 align-middle text-[26px] text-neutral-400">.</span>
          {String(day).padStart(2, '0')}
        </p>
        <p className="mt-4 text-[14px] tracking-wide text-neutral-500">{WEDDING.dateLabel}</p>
      </Reveal>

      <Reveal delay={200} className="w-full max-w-[320px]">
        <div className="border-y border-neutral-200 px-1 py-7">
          <div className="grid grid-cols-7 gap-y-3 text-center">
            {WEEK.map((label, i) => (
              <span
                key={label}
                className={cn(
                  'pb-2 text-[12px] tracking-wide',
                  i === 0 ? 'text-[#c08a7d]' : 'text-neutral-400',
                )}
              >
                {label}
              </span>
            ))}

            {cells.map((value, i) => {
              const isSunday = i % 7 === 0;
              const isWedding = value === day;
              return (
                <span key={i} className="flex items-center justify-center">
                  {value !== null && (
                    <span
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-[family-name:var(--font-myeongjo)]',
                        isWedding
                          ? 'bg-[#6c5c60] font-medium text-white'
                          : isSunday
                            ? 'text-[#c08a7d]'
                            : 'text-neutral-600',
                      )}
                    >
                      {value}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
