"use client";
import { useEffect, useState } from 'react';

export function useInterval(callback: () => void, delay: number) {
  useEffect(() => {
    const id = setInterval(callback, delay);
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
    if (typeof window === 'undefined' || !('performance' in window)) return;
    
    const observer = new PerformanceObserver((list) => {
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
    
    observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint'] });
    
    return () => observer.disconnect();
  }, []);
}

export function useFetchJson<T = any>(url: string): { data: T | null; loading: boolean; error: string | null } {
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
      .catch(e => { 
        if (!cancelled && e.name !== 'AbortError') { 
          setError(e.message); 
          setLoading(false); 
        } 
      });
    
    return () => { 
      cancelled = true; 
      abortController.abort();
    };
  }, [url]);
  
  return { data, loading, error };
}
