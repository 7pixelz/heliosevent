import React from 'react';

const ACCENT = '#adc905';

export function highlightExp(text: string | null | undefined): React.ReactNode {
  if (!text) return text;
  const parts = text.split(/(Experiences?|experiences?)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^experiences?$/i.test(part)
      ? <span key={i} style={{ color: ACCENT, fontWeight: 'inherit' }}>{part}</span>
      : part
  );
}
