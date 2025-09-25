"use client";
import React, { useEffect, useRef } from 'react';

export const BackgroundEffects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.innerHTML = '';
    const overlay = document.createElement('div');
    overlay.className = 'crt-glow-overlay';
    const scan = document.createElement('div');
    scan.className = 'crt-scan-lines';
    el.appendChild(overlay);
    el.appendChild(scan);
    let interval: any;
    const flicker = () => {
      if (document.hidden) return;
      if (Math.random() < 0.05) {
        overlay.style.animation = 'crt-flicker 0.1s ease-in-out';
        setTimeout(() => { overlay.style.animation = 'crt-glow 4s ease-in-out infinite alternate'; }, 100);
      }
    };
    interval = setInterval(flicker, 200);
    const visHandler = () => {
      if (document.hidden) { clearInterval(interval); interval = null; }
      else if (!interval) interval = setInterval(flicker, 200);
    };
    document.addEventListener('visibilitychange', visHandler);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', visHandler); };
  }, []);
  return <div id="matrix-rain" ref={containerRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none'}} />;
};
