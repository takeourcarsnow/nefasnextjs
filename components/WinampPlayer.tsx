"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Track { id: string; title: string; file: string }

export const WinampPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const visRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastVisRef = useRef(0);

  useEffect(() => {
    fetch('/data/playlist.json')
      .then(r => r.ok ? r.json() : [])
      .then((tracks: Track[]) => {
        if (tracks.length) setPlaylist(tracks);
        else setPlaylist([{ id: 'vaporwave', title: 'Vaporwave', file: '/audio/vaporwave.mp3' }]);
      })
      .catch(() => setPlaylist([{ id: 'vaporwave', title: 'Vaporwave', file: '/audio/vaporwave.mp3' }]));
  }, []);

  const current = playlist[index];

  useEffect(() => {
    if (audioRef.current && current) {
      audioRef.current.src = current.file;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [current, isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Visualizer (random bar heights like original placeholder)
  useEffect(() => {
    const container = visRef.current;
    if (!container) return;
    container.innerHTML = '';
    const bars: HTMLDivElement[] = [];
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement('div');
      bar.className = 'vis-bar';
      bar.style.height = '0%';
      container.appendChild(bar);
      bars.push(bar);
    }
    function loop(ts: number) {
      if (!isPlaying) { rafRef.current = requestAnimationFrame(loop); return; }
      if (ts - lastVisRef.current > 1000 / 30) {
        bars.forEach(b => { b.style.height = `${Math.random() * 100}%`; });
        lastVisRef.current = ts;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, current]);

  const nextTrack = useCallback(() => {
    setIndex(i => (playlist.length ? (i + 1) % playlist.length : 0));
  }, [playlist]);
  const prevTrack = useCallback(() => {
    setIndex(i => (playlist.length ? (i - 1 + playlist.length) % playlist.length : 0));
  }, [playlist]);

  return (
    <div id="winamp">
      <div className="winamp-song-info"><span id="winamp-song-title">{current?.title || 'Loading...'}</span></div>
      <div className="winamp-controls">
        <button className="winamp-btn" onClick={prevTrack}>⏮</button>
        {!isPlaying && <button className="winamp-btn" onClick={() => setIsPlaying(true)}>▶</button>}
        {isPlaying && <button className="winamp-btn" onClick={() => setIsPlaying(false)}>⏸</button>}
        <button className="winamp-btn" onClick={() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setIsPlaying(false);} }}>⏹</button>
        <button className="winamp-btn" onClick={nextTrack}>⏭</button>
        <span id="winamp-time">{formatTime(time)}</span>
        <div id="winamp-visualizer" className="winamp-visualizer" ref={visRef}></div>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={() => setTime(audioRef.current?.currentTime || 0)}
        onEnded={() => { setIsPlaying(true); nextTrack(); }}
      />
    </div>
  );
};
