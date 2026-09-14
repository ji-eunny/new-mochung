/** Clipboard API + 구형/비보안(HTTP)·인앱·iOS 브라우저용 폴백. */
export async function copyText(value: string): Promise<boolean> {
  // 1) 표준 Clipboard API (보안 컨텍스트에서만 동작: HTTPS/localhost)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch { /* 아래 레거시 방식으로 폴백 */ }

  // 2) 레거시 execCommand('copy') — HTTP(LAN)·iOS에서도 동작하도록 selection 처리
  if (typeof document === 'undefined') return false;
  const focused = document.activeElement as HTMLElement | null;
  const selection = document.getSelection();
  const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  const field = document.createElement('textarea');
  field.value = value;
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:0;opacity:0';
  document.body.append(field);

  // iOS Safari는 Range 기반 selection을 요구한다.
  const range = document.createRange();
  range.selectNodeContents(field);
  selection?.removeAllRanges();
  selection?.addRange(range);
  field.setSelectionRange(0, value.length);
  field.focus();

  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }

  field.remove();
  if (selection) {
    selection.removeAllRanges();
    if (savedRange) selection.addRange(savedRange);
  }
  focused?.focus({ preventScroll: true });
  return copied;
}
