'use client';
import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function ReadingProgress({ slug }) {
  const { data: session } = useSession();
  const userId = session?.user?.id || 'guest';
  const storageKey = `reading-progress-${userId}-${slug}`;
  const restored = useRef(false);

  // Restore scroll position on mount
  useEffect(() => {
    if (restored.current) return;
    const savedY = localStorage.getItem(storageKey);
    if (savedY) {
      const y = parseInt(savedY, 10);
      // Wait a tiny bit for images/layout to settle
      const timeout = setTimeout(() => {
        window.scrollTo(0, y);
        restored.current = true;
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [storageKey]);

  // Save scroll position (throttled)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          localStorage.setItem(storageKey, window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [storageKey]);

  return null; // invisible component
}