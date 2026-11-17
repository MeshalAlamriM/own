/**
 * Converts editor-provided HTML into safe, readable plain text.
 * All markup is removed rather than allow-listed, so the result can safely be
 * rendered by React or used in metadata without dangerouslySetInnerHTML.
 */
export function sanitizeHtml(input: unknown): string {
  if (typeof input !== 'string' || !input) return '';

  return input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<\/(p|div|li|h[1-6]|tr|blockquote|section|article)\s*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[\t\f\v ]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
