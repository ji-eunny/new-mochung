/** Clipboard API with a fallback for older in-app browsers. */
export async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(value); return true; }
  } catch { /* Try the legacy selection-based API. */ }
  const focused = document.activeElement as HTMLElement | null;
  const field = document.createElement('textarea');
  field.value = value;
  field.style.cssText = 'position:fixed;left:-9999px;top:0';
  field.setAttribute('readonly', '');
  document.body.append(field);
  field.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  finally { field.remove(); focused?.focus({ preventScroll: true }); }
  return copied;
}
