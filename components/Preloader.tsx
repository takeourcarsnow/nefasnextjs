"use client";
import React, { useEffect, useState } from 'react';
import { preloaderFrames } from '../utils/preloader.ts';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    let progress = 0;
    let lastFrameIndex = 0;
    let cancelled = false;

    const failsafe = setTimeout(() => {
      if (!cancelled) finish();
    }, 6000);

    function finish() {
      setCompleted(true);
      // Add preloader-complete class to body to enable scrolling
      if (typeof document !== 'undefined') {
        document.body.classList.add('preloader-complete');
      }
      onComplete();
    }

    const animate = () => {
      if (cancelled) return;
      let t = progress / (preloaderFrames.length - 1);
      if (t > 0.8) {
        t = 0.8 + 0.2 * ((t - 0.8) / 0.2) * (2 - (t - 0.8) / 0.2); // easeOutQuad inline
      }
      let nextFrame = Math.min(
        Math.floor(t * (preloaderFrames.length - 1)),
        preloaderFrames.length - 1
      );
      if (nextFrame < lastFrameIndex) nextFrame = lastFrameIndex;
      lastFrameIndex = nextFrame;
      setFrameIndex(nextFrame);
      if (nextFrame >= preloaderFrames.length - 1) {
        finish();
        return;
      }
      let increment = 1 + Math.floor(Math.random() * 2);
      if (Math.random() < 0.08 && progress < preloaderFrames.length - 10) {
        increment += Math.floor(Math.random() * 3);
      }
      let delay = 40 + Math.random() * 60;
      if (Math.random() < 0.12) delay += Math.random() * 200;
      if (progress > preloaderFrames.length * 0.85) {
        delay += 120 * (progress / preloaderFrames.length);
      }
      progress += increment;
      setTimeout(() => requestAnimationFrame(animate), delay);
    };

    requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      clearTimeout(failsafe);
    };
  }, [completed, onComplete]);

  return (
    <div
      id="preloader"
      className="preloader"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg,#0a0a0a 0%,#0a0a0f 25%,#0a0a0a 50%,#0f0a0f 75%,#0a0a0a 100%)',
        color: '#00ff9d',
        display: completed ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        fontFamily: 'VT323, monospace',
        padding: '20px'
      }}
    >
      <div className="preloader-inner">
        <div className="preloader-logo-wrapper">
          {/* Use public folder path; Next serves files in /public at root */}
          <img src="/images/logo.svg" alt="nefas.tv logo" className="preloader-logo" />
        </div>
        <pre id="preloader-text" style={{ fontSize: '18px', lineHeight: 1.15 }}>{preloaderFrames[frameIndex]}</pre>
      </div>
    </div>
  );
};
