'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    function observe() {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((el) => {
            if (el.isIntersecting) el.target.classList.add('vis');
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));
      return obs;
    }

    // Run immediately for elements already in DOM
    let obs = observe();

    // Re-run after a short delay to catch async-rendered sections
    const t1 = setTimeout(() => { obs.disconnect(); obs = observe(); }, 300);
    const t2 = setTimeout(() => { obs.disconnect(); obs = observe(); }, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      obs.disconnect();
    };
  }, [pathname]);

  return null;
}
