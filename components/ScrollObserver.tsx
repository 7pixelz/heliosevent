'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    let obs: IntersectionObserver;

    // Defer past React's hydration commit so DOM mutations don't cause mismatch warnings.
    const raf = requestAnimationFrame(() => {
      const elements = Array.from(document.querySelectorAll('.fade-up'));

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95) {
          el.classList.remove('ready');
          el.classList.add('vis');
        } else {
          el.classList.add('ready');
        }
      });

      obs = new IntersectionObserver(
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
    });

    return () => {
      cancelAnimationFrame(raf);
      obs?.disconnect();
    };
  }, [pathname]);

  return null;
}
