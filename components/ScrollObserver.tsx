'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let obs: IntersectionObserver | null = null;

    function start() {
      obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((el) => {
            if (el.isIntersecting) el.target.classList.add('vis');
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.fade-up').forEach((el) => obs!.observe(el));
    }

    // Defer past React's hydration pass to avoid className mismatch warnings.
    // Re-run later to catch sections that stream in after initial render.
    const t0 = setTimeout(start, 0);
    const t1 = setTimeout(() => { obs?.disconnect(); start(); }, 300);
    const t2 = setTimeout(() => { obs?.disconnect(); start(); }, 800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      obs?.disconnect();
    };
  }, [pathname]);

  return null;
}
