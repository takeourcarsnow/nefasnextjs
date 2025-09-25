"use client";
import React, { useEffect, useRef } from 'react';

const leftFrames = ['[>', '[>', '[ >', '[>'];
const rightFrames = ['<]', ' <]', '< ]', '<]'];
const glitchChars = ['#', '@', '$', '%', '&', '*', '!', '?', '0', '1', 'X', 'Z', 'Q'];
const originalText = 'nefas.tv';

export const HeaderEffects: React.FC = () => {
  const leftRef = useRef<HTMLSpanElement | null>(null);
  const rightRef = useRef<HTMLSpanElement | null>(null);
  const titleRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    let frame = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const run = () => {
      if (document.hidden) return;
      if (leftRef.current) leftRef.current.textContent = leftFrames[frame];
      if (rightRef.current) rightRef.current.textContent = rightFrames[frame];
      frame = (frame + 1) % leftFrames.length;
    };
    intervalId = setInterval(run, 800);
    const vis = () => {
      if (document.hidden) {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
      } else if (!intervalId) {
        intervalId = setInterval(run, 800);
      }
    };
    document.addEventListener('visibilitychange', vis);
    return () => { if (intervalId) clearInterval(intervalId); document.removeEventListener('visibilitychange', vis); };
  }, []);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let running = true;
    const glitch = () => {
      if (!running || document.hidden) return;
      if (Math.random() < 0.5 && titleRef.current) {
        const chars = originalText.split('');
        const count = 1 + Math.floor(Math.random() * 4);
        const idxs: number[] = [];
        while (idxs.length < count) { const i = Math.floor(Math.random()*chars.length); if (!idxs.includes(i)) idxs.push(i); }
        idxs.forEach(i => { chars[i] = glitchChars[Math.floor(Math.random()*glitchChars.length)]; });
        titleRef.current.textContent = chars.join('');
        if (leftRef.current) leftRef.current.textContent = leftFrames[0];
        if (rightRef.current) rightRef.current.textContent = rightFrames[0];
      } else if (titleRef.current) {
        titleRef.current.textContent = originalText;
      }
      timeoutId = setTimeout(glitch, 600 + Math.random() * 600);
    };
    glitch();
    const vis = () => {
      if (document.hidden) { running = false; if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; } }
      else { if (!running) { running = true; glitch(); } }
    };
    document.addEventListener('visibilitychange', vis);
    return () => { running = false; if (timeoutId) clearTimeout(timeoutId); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return (
    <span>
      <span id="ascii-header" ref={leftRef}></span>{' '}
      <span ref={titleRef}>{originalText}</span>{' '}
      <span id="ascii-header-right" ref={rightRef}></span>
    </span>
  );
};
