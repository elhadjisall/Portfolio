const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (char) => ESCAPES[char]);

/** Render the two inline styles used in content.ts: **bold** and `code`. */
export function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

/** Attributes Umami reads without JavaScript; analytics.ts forwards them to GA4. */
export function umamiEvent(name: string, props: Record<string, string> = {}) {
  const attributes: Record<string, string> = { 'data-umami-event': name };
  for (const [key, value] of Object.entries(props)) {
    attributes[`data-umami-event-${key}`] = value;
  }
  return attributes;
}
