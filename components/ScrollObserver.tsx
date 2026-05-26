'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.fade-up'));

    // Elements already in the viewport get vis immediately — no invisible flash.
    // Elements below the fold get ready (opacity 0) and are observed for scroll.
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.remove('ready');
        el.classList.add('vis');
      } else {
        el.classList.add('ready');
      }
    });

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.remove('ready');
            e.target.classList.add('vis');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );

    elements.forEach(el => {
      if (!el.classList.contains('vis')) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [pathname]);

  return null;
}
