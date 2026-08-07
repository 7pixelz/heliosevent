/**
 * Cleans up internal links (relative, or absolute heliosevent.in URLs) authored
 * via the admin rich-text editors. Tiptap's Link extension defaults every new
 * link to target="_blank" rel="noopener noreferrer nofollow" regardless of
 * whether the URL is internal or external, since it can't tell at insert time.
 * For internal links that's all wrong: nofollow blocks link equity/crawling to
 * our own pages, target="_blank" breaks normal same-site navigation, and
 * noopener/noreferrer are meaningless without target="_blank" — so this strips
 * target and the whole rel attribute entirely for internal links.
 */
export function cleanInternalLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (tag, attrs) => {
    const hrefMatch = attrs.match(/\shref="([^"]*)"/i);
    if (!hrefMatch) return tag;
    const href = hrefMatch[1];
    const isInternal = href.startsWith('/') || /^https?:\/\/(?:www\.)?heliosevent\.in(\/|$|")/i.test(href);
    if (!isInternal) return tag;

    const newAttrs = attrs
      .replace(/\s+target="_blank"/i, '')
      .replace(/\s+rel="[^"]*"/i, '');
    return `<a${newAttrs}>`;
  });
}
