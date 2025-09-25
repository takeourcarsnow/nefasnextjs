/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { PhotoItem } from '../types/content.ts';

interface ViewerModalProps {
  photos: PhotoItem[];
  index: number;
  onClose: () => void;
  setIndex: (i: number) => void;
}

export const ViewerModal: React.FC<ViewerModalProps> = ({ photos, index, onClose, setIndex }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const photo = photos[index];
  // Do not early-return here because hooks must be called unconditionally.

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setLastPan({ x: 0, y: 0 });
  }, []);

  // Navigation functions
  const goNext = useCallback(() => {
    const nextIndex = (index + 1) % photos.length;
    setIndex(nextIndex);
    resetZoom();
  }, [index, photos.length, setIndex, resetZoom]);

  const goPrev = useCallback(() => {
    const prevIndex = (index - 1 + photos.length) % photos.length;
    setIndex(prevIndex);
    resetZoom();
  }, [index, photos.length, setIndex, resetZoom]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          goNext();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goNext, goPrev]);

  // Mouse events for zoom and pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLastPan(pan);
    e.preventDefault();
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || zoom === 1) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setPan({
      x: lastPan.x + deltaX,
      y: lastPan.y + deltaY
    });
  }, [isDragging, zoom, dragStart, lastPan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch events for mobile swipe -- hooks and handlers are declared unconditionally
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches.length === 1) {
      const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = Math.abs(touchEnd.y - touchStart.y);

      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) goPrev();
        else goNext();
      }
    }
  }, [touchStart, goPrev, goNext]);

  // Click to zoom
  const handleImageClick = useCallback(() => {
    if (isDragging) return;

    if (zoom === 1) {
      setZoom(2);
    } else {
      resetZoom();
    }
  }, [zoom, isDragging, resetZoom]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(1, Math.min(3, zoom + delta));
    setZoom(newZoom);
    
    if (newZoom === 1) {
      setPan({ x: 0, y: 0 });
      setLastPan({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Format date and tags
  const formattedDate = photo.date ? new Date(photo.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : '';
  const tags = photo.tags?.map(tag => `#${tag}`).join(' ') || '';

  if (!photo) return null;

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: 'rgba(0,0,0,0.95)', 
        zIndex: 10000, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button 
        style={{ 
          position: 'fixed',
          top: 24,
          right: 32,
          background: 'none',
          border: 'none',
          color: '#00ff9d',
          fontSize: '2.1em',
          cursor: 'pointer',
          zIndex: 10001,
          display: zoom > 1 ? 'none' : 'block'
        }} 
        onClick={onClose}
      >
        ×
      </button>

      {/* Navigation arrows */}
      {zoom === 1 && (
        <>
          <button 
            style={{ 
              position: 'absolute',
              left: 32,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#00ff9d',
              fontSize: '2.5em',
              cursor: 'pointer',
              zIndex: 10002
            }} 
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          >
            ◀
          </button>
          <button 
            style={{ 
              position: 'absolute',
              right: 32,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#00ff9d',
              fontSize: '2.5em',
              cursor: 'pointer',
              zIndex: 10002
            }} 
            onClick={(e) => { e.stopPropagation(); goNext(); }}
          >
            ▶
          </button>
        </>
      )}

      {/* Image container */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '80%',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={imgRef}
          src={photo.image}
          alt={photo.title}
          style={{
            maxWidth: zoom === 1 ? '90vw' : 'none',
            maxHeight: zoom === 1 ? '80vh' : 'none',
            width: zoom > 1 ? 'auto' : undefined,
            height: zoom > 1 ? 'auto' : undefined,
            objectFit: 'contain',
            borderRadius: 8,
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            cursor: zoom === 1 ? 'zoom-in' : (isDragging ? 'grabbing' : 'grab'),
            userSelect: 'none'
          }}
          onClick={handleImageClick}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          draggable={false}
        />
      </div>

      {/* Image info */}
      <div style={{ 
        color: 'white', 
        marginTop: 18, 
        textAlign: 'center', 
        maxWidth: '90vw',
        zIndex: 10001,
        display: zoom > 1 ? 'none' : 'block'
      }}>
        <h3 style={{ 
          margin: '0 0 5px 0', 
          color: '#00ff9d',
          textShadow: '0 0 8px #00ff9d, 0 0 2px #fff'
        }}>
          {photo.title}
        </h3>
        <p style={{ 
          margin: '0 0 10px 0', 
          color: '#ccc', 
          fontSize: '1.1em',
          background: 'rgba(0,0,0,0.7)',
          display: 'inline-block',
          padding: '4px 16px',
          borderRadius: 6
        }}>
          {photo.description}
        </p>
        <div style={{ fontSize: '0.9em', color: '#666' }}>
          {formattedDate}{tags ? ` • ${tags}` : ''}
        </div>
        <div style={{ fontSize: '0.8em', color: '#555', marginTop: 8 }}>
          {index + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
};
