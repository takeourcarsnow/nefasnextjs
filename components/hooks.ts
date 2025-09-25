"use client";
import { useEffect, useState } from 'react';

export function useInterval(callback: () => void, delay: number) {
  useEffect(() => {
    const id: ReturnType<typeof setInterval> = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}

export function useNow() {
  const [now, setNow] = useState<Date>(new Date());
  useInterval(() => setNow(new Date()), 1000);
  return now;
}

export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window) || typeof PerformanceObserver === 'undefined') return;

    const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log(`Page load time: ${navEntry.loadEventEnd - navEntry.fetchStart}ms`);
        }
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`LCP: ${entry.startTime}ms`);
        }
      });
    });

    try {
      // PerformanceObserver.observe accepts an options object for entryTypes
      // defensively ensure observe exists and call with a plain object
      if (typeof observer.observe === 'function') {
        observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });
      } else {
        // eslint-disable-next-line no-console
        console.warn('PerformanceObserver.observe is not a function on this platform');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('PerformanceObserver.observe failed', err);
    }

    return () => observer.disconnect();
  }, []);
}

export function useFetchJson<T = unknown>(url: string): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    const abortController = new AbortController();
    
    setLoading(true);
    setError(null);
    
    fetch(url, {
      signal: abortController.signal,
      headers: {
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      },
    })
      .then(r => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(json => { 
        if (!cancelled) { 
          setData(json); 
          setLoading(false); 
        } 
      })
      .catch((e: unknown) => { 
        if (!cancelled) {
          // if it's an AbortError the controller will have handled it
          const err = e as Error;
          if (err?.name !== 'AbortError') {
            setError(err?.message ?? String(e));
            setLoading(false);
          }
        }
      });
    
    return () => { 
      cancelled = true; 
      abortController.abort();
    };
  }, [url]);
  
  return { data, loading, error };
}
