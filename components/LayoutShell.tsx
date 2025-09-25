"use client";
import React from 'react';
import { Header } from './Header.tsx';
import { BackgroundEffects } from './BackgroundEffects.tsx';
import { WinampPlayer } from './WinampPlayer.tsx';
import { Navigation } from './Navigation.tsx';
import { HomeSection } from './HomeSection.tsx';
import { BlogSection } from './BlogSection.tsx';
import { PhotoSection } from './PhotoSection.tsx';
import { VideoSection } from './VideoSection.tsx';
import { Renders3DSection } from './Renders3DSection.tsx';
import { WebdevSection } from './WebdevSection.tsx';
import { MiscSection } from './MiscSection.tsx';
import { FooterTimestamp } from './FooterTimestamp.tsx';
import { SectionProvider } from './SectionContext.tsx';
import { usePerformanceMonitor } from './hooks.ts';
import { ErrorBoundary } from './ErrorBoundary.tsx';

// Placeholder removed (unused) to avoid lint warning

const Inner: React.FC = () => {
  usePerformanceMonitor();
  
  return (
    <>
      <BackgroundEffects />
      <div className="site-container">
        <Header />
        <WinampPlayer />
        <Navigation />
        <main id="content-area">
          <ErrorBoundary>
            <HomeSection />
            <VideoSection />
            <PhotoSection />
            <Renders3DSection />
            <WebdevSection />
            <BlogSection />
            <MiscSection />
          </ErrorBoundary>
        </main>
        <footer>
          <div className="footer-content">
            <div className="footer-left">
              <FooterTimestamp />
              <span className="footer-status">[ ONLINE ]</span>
            </div>
            <div className="footer-center">
              <span>© 2025 nefas.tv</span>
            </div>
            <div className="footer-right">
              <span className="footer-terminal">terminal_active.exe</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export const LayoutShell: React.FC = () => {
  return (
    <SectionProvider>
      <Inner />
    </SectionProvider>
  );
};
