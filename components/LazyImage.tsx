"use client";
import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, style, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={className}
      style={{
        ...style,
        background: error ? '#333' : loaded ? 'transparent' : '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: style?.height || 200,
      }}
      onClick={onClick}
    >
      {error ? (
        <span style={{ color: '#666', fontSize: '0.8em' }}>Failed to load</span>
      ) : inView ? (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            ...style,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            width: '100%',
            height: style?.height || 200,
            objectFit: 'cover' as const,
          }}
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: style?.height || 200, 
          background: 'linear-gradient(90deg, #111 25%, #222 50%, #111 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 2s infinite'
        }} />
      )}
      <style jsx>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};