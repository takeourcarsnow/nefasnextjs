/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from 'react';
import { TerminalLines } from './sectionTerminalContent.tsx';
import { useSection } from './SectionContext.tsx';
import type { PhotoEntry, Render3DItem, VideoItem, WebdevProjectItem, BlogPostMeta } from '../types/content.ts';

interface LatestState<T> {
  data: T[];
  loading: boolean;
}

const useLatest = <T,>(url: string, limit = 3) => {
  const [state, setState] = useState<LatestState<T>>({ data: [], loading: true });
  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then(r => r.json())
      .then((items: T[]) => {
        if (cancelled) return;
        // naive date sort if possible
  const hasDate = (x: unknown): x is { date?: string } => !!x && typeof (x as { date?: unknown }).date === 'string';
        const sorted = [...items].sort((a, b) => {
          if (hasDate(a) && hasDate(b)) return new Date(b.date!).getTime() - new Date(a.date!).getTime();
          return 0;
        });
        setState({ data: sorted.slice(0, limit), loading: false });
      })
      .catch(() => { if (!cancelled) setState({ data: [], loading: false }); });
    return () => { cancelled = true; };
  }, [url, limit]);
  return state;
};

export const HomeSection: React.FC = () => {
  const { active, setActive } = useSection();
  const blogs = useLatest<BlogPostMeta>('/data/posts.json');
  const videos = useLatest<VideoItem>('/data/videos.json');
  const photos = useLatest<PhotoEntry>('/data/photos.json');
  const renders3d = useLatest<Render3DItem>('/data/3d.json');
  const webdev = useLatest<WebdevProjectItem>('/data/webdev.json');

  return (
    <div 
      id="home-content" 
      className="content-section"
      style={{ display: active === 'home-content' ? 'block' : 'none' }}
    >
      <TerminalLines sectionId="home-content" />
      <ContentBlock title="> latest web stuff" caption="building and hoping that it just works" onJump={() => setActive('webdev-content')}>
        {webdev.loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid-container">
            {webdev.data.map((p, idx) => {
              const obj = p as unknown as { id?: string; image?: string; title?: string; date?: string };
              const key = obj.id ?? obj.title ?? idx;
              return (
                <a key={key} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('webdev-content'); }}>
                  <img src={obj.image ?? ''} alt={obj.title ?? 'untitled'} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                  <div>
                    <p className="home-post-type">[WEBDEV]</p>
                    <h4 className="home-post-title">{obj.title ?? 'untitled'}</h4>
                  </div>
                  <div>
                    <p className="home-post-date">{obj.date ? new Date(obj.date).toLocaleDateString() : ''}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </ContentBlock>
      <ContentBlock title="> fresh photos" caption="megapixels and emulsion" onJump={() => setActive('photo-content')}>
        {photos.loading ? <p>Loading...</p> : (
          <div className="grid-container">
            {photos.data.map((p, idx) => {
              if ((p as unknown as { type?: string }).type === 'album') {
                const a = p as unknown as { title?: string; coverImage?: string; date?: string; description?: string };
                const key = a.title ?? a.coverImage ?? idx;
                return (
                  <a key={key} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('photo-content'); }}>
                    <img src={a.coverImage} alt={a.title} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                    <div>
                      <p className="home-post-type">[ALBUM]</p>
                      <h4 className="home-post-title">{a.title}</h4>
                    </div>
                    <div>
                      <p className="home-post-date">{a.date ? new Date(a.date).toLocaleDateString() : ''}</p>
                    </div>
                  </a>
                );
              }
              const photo = p as unknown as { title?: string; thumbnail?: string; date?: string; description?: string };
              return (
                <a key={photo.title ?? photo.thumbnail ?? idx} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('photo-content'); }}>
                  <img src={photo.thumbnail} alt={photo.title} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                  <div>
                    <p className="home-post-type">[PHOTO]</p>
                    <h4 className="home-post-title">{photo.title}</h4>
                  </div>
                  <div>
                    <p className="home-post-date">{photo.date ? new Date(photo.date).toLocaleDateString() : ''}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </ContentBlock>
      <ContentBlock title="> new renders" caption="fresh cgi right off the gpu" onJump={() => setActive('3d-content')}>
        {renders3d.loading ? <p>Loading...</p> : (
          <div className="grid-container">
            {renders3d.data.map((r, idx) => (
              <a key={(r as any).id ?? r.title ?? r.thumbnail ?? idx} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('3d-content'); }}>
                <img src={r.thumbnail} alt={r.title} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                <div>
                  <p className="home-post-type">[3D]</p>
                  <h4 className="home-post-title">{r.title}</h4>
                </div>
                <div>
                  <p className="home-post-date">{new Date(r.date).toLocaleDateString()}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </ContentBlock>
  <ContentBlock title="> latest videos" caption="a collection of moving pictures. i&apos;ll replace these with my own stuff eventually. probably." onJump={() => setActive('video-content')}>
        {videos.loading ? <p>Loading...</p> : (
          <div className="grid-container">
            {videos.data.map((v, idx) => (
              <a key={(v as any).id ?? v.title ?? v.thumbnail ?? idx} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('video-content'); }}>
                <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: 120, objectFit: 'cover', marginBottom: 12, borderRadius: 6 }} />
                <div>
                  <p className="home-post-type">[VIDEO]</p>
                  <h4 className="home-post-title">{v.title}</h4>
                </div>
                <div>
                  <p className="home-post-date">{new Date(v.date).toLocaleDateString()}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </ContentBlock>
      <ContentBlock title="> recent blogs" caption="fresh thoughts for your brain" onJump={() => setActive('blog-content')}>
        {blogs.loading ? <p>Loading...</p> : (
          <div className="grid-container">
            {blogs.data.map((b, idx) => (
              <a key={b.id ?? b.title ?? idx} href="#" className="grid-item home-post-item" onClick={(e) => { e.preventDefault(); setActive('blog-content'); }}>
                <div>
                  <p className="home-post-type">[BLOG]</p>
                  <h4 className="home-post-title">{b.title}</h4>
                </div>
                <div>
                  <p className="home-post-date">{new Date(b.date).toLocaleDateString()}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </ContentBlock>
    </div>
  );
};

const ContentBlock: React.FC<{ title: string; caption: string; onJump: () => void; children: React.ReactNode }> = ({ title, caption, onJump, children }) => {
  return (
    <section style={{ marginTop: 40 }}>
      <h3 className="decrypt-text home-jump-tab" style={{ marginTop: 40, marginBottom: 5, cursor: 'pointer' }} onClick={onJump}>{title}</h3>
      <p className="typewriter-text" style={{ marginBottom: 20, color: '#00ff9d' }}>{caption}</p>
      {children}
    </section>
  );
};
