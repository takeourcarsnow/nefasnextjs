"use client";
import React from 'react';
import { useNow } from './hooks.ts';

export const FooterTimestamp: React.FC = () => {
  const now = useNow();
  const ts = now.toLocaleTimeString();
  return <span className="footer-timestamp">{ts}</span>;
};
