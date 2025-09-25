"use client";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSection } from './SectionContext.tsx';
import { blogContent } from './blogContent.ts';

interface Post { id: string; title: string; date: string; tags: string[]; content: { en: string[]; lt?: string[] }; }

export const BlogSection: React.FC = () => {
  const { active } = useSection();
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const [terminalDone, setTerminalDone] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [lang, setLang] = useState<'en' | 'lt'>((typeof window !== 'undefined' && (sessionStorage.getItem('blogLang') as 'en'|'lt')) || 'en');

  // Load posts once terminal finished (or in parallel but render after)
  useEffect(() => {
    if (active !== 'blog-content') return;
    fetch('/data/posts.json').then(r => r.json()).then((p: Post[]) => setPosts(p));
  }, [active]);

  // Terminal effect
  useEffect(() => {
    if (active !== 'blog-content') return;
    const el = terminalRef.current;
    if (!el || el.childElementCount > 0) return;
    
    // Add typing class to hide content during typing
    const blogSection = document.getElementById('blog-content');
    if (blogSection) {
      blogSection.classList.add('typing-in-progress');
    }
    
    let cancelled = false;
    (async () => {
      for (const line of blogContent) {
        if (cancelled) return;
        const lineDiv = document.createElement('div');
        lineDiv.style.lineHeight = '1.1';
        lineDiv.style.margin = '0';
        lineDiv.style.padding = '0';
        if (line.color) lineDiv.style.color = line.color;
        el.appendChild(lineDiv);
        const span = document.createElement('span');
        lineDiv.appendChild(span);
        for (let i = 0; i < line.text.length; i++) {
          if (cancelled) return;
          span.textContent += line.text[i];
          await new Promise(r => setTimeout(r, 6));
        }
        await new Promise(r => setTimeout(r, line.delay));
      }
      // Remove typing class and show content
      if (blogSection) {
        blogSection.classList.remove('typing-in-progress');
      }
      setTerminalDone(true);
    })();
    return () => { 
      cancelled = true;
      // Cleanup: remove typing class
      if (blogSection) {
        blogSection.classList.remove('typing-in-progress');
      }
    };
  }, [active]);

  // Persist expanded + lang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('expandedPosts', JSON.stringify([...expanded]));
      sessionStorage.setItem('blogLang', lang);
    }
  }, [expanded, lang]);

  // Restore expanded
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('expandedPosts');
      if (stored) setExpanded(new Set(JSON.parse(stored)));
    }
  }, []);

  const toggle = useCallback((title: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  }, []);

  return (
    <div 
      id="blog-content" 
      className="content-section"
      style={{ display: active === 'blog-content' ? 'block' : 'none' }}
    >
      <div ref={terminalRef} id="blog-terminal-output" className="terminal-output" />
      {terminalDone && (
        <div style={{ marginTop: 24 }}>
          {posts.map(p => {
            const isOpen = expanded.has(p.title);
            const contentArr = p.content[lang] || p.content.en;
            return (
              <div key={p.id} className="blog-snippet" style={{ marginBottom: 24 }}>
                <div className="blog-snippet-header" style={{ cursor: 'pointer' }} onClick={() => toggle(p.title)}>
                  <h3>&gt; {p.title}</h3>
                  <span className="blog-date">{new Date(p.date).toLocaleDateString()}</span>{' '}
                  <span className="blog-tags">{p.tags.map(t => <span key={t} className="blog-tag">{t}</span>)}</span>{' '}
                  <span className="blog-toggle">{isOpen ? '[ ...read less ]' : '[ read more... ]'}</span>
                </div>
                {isOpen && (
                  <div className="blog-full-content expanded">
                    <div className="blog-lang-switcher" style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', margin: '8px 0' }}>
                      <button className={`blog-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
                      <button className={`blog-lang-btn ${lang === 'lt' ? 'active' : ''}`} onClick={() => setLang('lt')}>Lietuviškai</button>
                    </div>
                    <div className="blog-content-text">
                      {contentArr.map((para, i) => <p key={i}>{para}</p>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
