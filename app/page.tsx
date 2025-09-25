"use client";
import { LayoutShell } from '../components/LayoutShell.tsx';
import { Preloader } from '../components/Preloader.tsx';
import React, { Suspense, useState } from 'react';

export default function Page() {
  const [ready, setReady] = useState(false);
  return (
    <>
      {!ready && <Preloader onComplete={() => setReady(true)} />}
      {ready && (
        <Suspense fallback={<div>Loading...</div>}>
          <LayoutShell />
        </Suspense>
      )}
    </>
  );
}
