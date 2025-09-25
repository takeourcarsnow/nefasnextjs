"use client";
import React from 'react';
import { useSection } from './SectionContext.tsx';

export interface TerminalLine { text: string; color?: string; delay: number; }

export const sectionTerminalContent: Record<string, TerminalLine[]> = {
  /* content reproduced from legacy content.js */
  'home-content': [
    { text: '> sudo ./nefas.tv --verbose', color: '#00ff9d', delay: 80 },
    { text: '> Launching from tty3...', color: '#00ff9d', delay: 60 },
    { text: '[✓] IPv6 thread established', color: '#00ff00', delay: 50 },
    { text: '[⚠] normie.exe not located', color: '#ffaa00', delay: 40 },
    { text: '', delay: 25 },
    { text: '——— WELCOME TO NEFAS.TV, EXPLORER ———', color: '#ff00ff', delay: 25 },
    { text: '├── /home/nefas/bin/', color: '#ffffff', delay: 20 },
    { text: '│   ├── brain_dumps/        # half-thoughts & raw sparks', color: '#fff', delay: 15 },
    { text: '│   ├── spaghetti_code/     # entropy in logic form', color: '#fff', delay: 15 },
    { text: '│   └── creative_autism/    # signal through noise', color: '#fff', delay: 15 },
    { text: '', delay: 20 },
    { text: '> it runs. no docs. no errors. just peace.', color: '#00ff9d', delay: 20 },
    { text: 'Active Extensions: jpg | mp4 | c4d | js | txt', color: '#ffff00', delay: 20 },
    { text: '', delay: 15 },
    { text: 'STATUS: comfier than a warm ThinkPad on your lap', color: '#00ff9d', delay: 15 },
    { text: '', delay: 15 },
    { text: '✉ ignasnefas@gmail.com | git: @takeourcarsnow', color: '#00ffff', delay: 30 },
    { text: '↓ Memory dump initiated ↓', color: '#ff00ff', delay: 15 }
  ],
  'video-content': [
    { text: '> mpv --loop=inf --speed=1.5 reality.mkv', color: '#00ff9d', delay: 300 },
    { text: '> Audio: [######### ] 90% vibes detected', color: '#00ff9d', delay: 200 },
    { text: '', delay: 50 },
    { text: '    ▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄', color: '#ff00ff', delay: 100 },
    { text: '   ▐  ▶  PLAY  ■  STOP  ⟲  LOOP    ▌', color: '#ffff00', delay: 50 },
    { text: '    ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀', color: '#ff00ff', delay: 100 },
    { text: '', delay: 50 },
    { text: '[REC] Currently capturing photons...', color: '#ff0000', delay: 50 },
    { text: '', delay: 50 },
    { text: '⟐ Resolution: Whatever looked good', color: '#fff', delay: 50 },
    { text: '⟐ Frame rate: Smooth enough', color: '#fff', delay: 50 },
    { text: '⟐ Audio: Present and accounted for', color: '#fff', delay: 50 },
    { text: '', delay: 50 },
    { text: 'WARNING: May contain traces of art', color: '#ffaa00', delay: 100 },
    { text: 'RUNTIME: Long enough to matter', color: '#00ff9d', delay: 50 }
  ],
  'photo-content': [
    { text: '> exiftool -all= *.jpg # privacy first', color: '#00ff9d', delay: 300 },
    { text: '> 42 files stripped of their souls', color: '#00ffff', delay: 200 },
    { text: '', delay: 50 },
    { text: '◉ ◉ ◉ LOADING PHOTONS.RAW ◉ ◉ ◉', color: '#ffff00', delay: 200 },
    { text: '', delay: 50 },
    { text: '╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲', color: '#ff00ff', delay: 50 },
    { text: '  Light borrowed, never returned', color: '#fff', delay: 50 },
    { text: '  Shot on: whatever was in my pocket', color: '#fff', delay: 50 },
    { text: '╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱', color: '#ff00ff', delay: 50 },
    { text: '', delay: 50 },
    { text: '[F/1.4] Bokeh mode: MAXIMUM', color: '#00ff00', delay: 50 },
    { text: '[ISO] Pushed to the limit', color: '#ffaa00', delay: 50 },
    { text: '[1/125] Time frozen successfully', color: '#00ffff', delay: 50 },
    { text: '', delay: 50 },
    { text: '* Click to zoom into the void *', color: '#ff00ff', delay: 50 }
  ],
  '3d-content': [
    { text: '> nvidia-smi | grep "thermal throttling"', color: '#00ff9d', delay: 300 },
    { text: '> GPU 0: YES - 99°C - Warranty voided', color: '#ff0000', delay: 200 },
    { text: '> Worth it for the subsurface scattering', color: '#00ff9d', delay: 100 },
    { text: '', delay: 50 },
    { text: '      ▲▼▲▼▲▼▲▼', color: '#ffff00', delay: 50 },
    { text: '     ╱ POLYGON  ╲', color: '#ffff00', delay: 50 },
    { text: '    ╱  FACTORY   ╲', color: '#ffff00', delay: 50 },
    { text: '   ╱   [ACTIVE]   ╲', color: '#ffff00', delay: 50 },
    { text: '  ▼▲▼▲▼▲▼▲▼▲▼▲▼▲▼', color: '#ffff00', delay: 50 },
    { text: '', delay: 50 },
    { text: '◢ Vertices: Yes', color: '#00ff00', delay: 50 },
    { text: '◣ Topology: Questionable at best', color: '#ffaa00', delay: 50 },
    { text: '◤ N-gons: More than recommended', color: '#ff0000', delay: 50 },
    { text: '◥ UV Maps: "It\'s procedural bro"', color: '#ff00ff', delay: 50 },
    { text: '', delay: 50 },
    { text: 'Render engine: Whatever\'s free', color: '#00ffff', delay: 50 },
    { text: 'Samples: Not enough', color: '#ffaa00', delay: 50 },
    { text: 'Denoiser: Doing its best', color: '#00ff00', delay: 50 },
    { text: 'Time to completion: heat death of universe', color: '#ff00ff', delay: 50 }
  ],
  'webdev-content': [
    { text: '$ npm audit', color: '#00ff9d', delay: 300 },
    { text: 'found 42069 vulnerabilities (42069 high)', color: '#ff0000', delay: 200 },
    { text: '', delay: 50 },
    { text: '┌────────────────', color: '#fff', delay: 50 },
    { text: '│ PRODUCTION   ¯\\_(ツ)_/¯              ', color: '#fff', delay: 50 },
    { text: '│ READY?       npm run yolo            ', color: '#fff', delay: 50 },
    { text: '└────────────────', color: '#fff', delay: 50 },
    { text: '', delay: 50 },
    { text: '<WEB_EXPERIMENTS>', color: '#ff00ff', delay: 100 },
    { text: '  <LOCALHOST port="3000">', color: '#ffff00', delay: 50 },
    { text: '    <STATUS>BARELY_FUNCTIONAL</STATUS>', color: '#ffff00', delay: 50 },
    { text: '  </LOCALHOST>', color: '#ffff00', delay: 50 },
    { text: '</WEB_EXPERIMENTS>', color: '#ff00ff', delay: 100 },
    { text: '', delay: 50 },
    { text: '» digital alchemy with questionable ethics', color: '#fff', delay: 50 },
    { text: '» tested in production like a true warrior', color: '#fff', delay: 50 },
    { text: '» may contain console.log("why god why")', color: '#fff', delay: 50 },
    { text: '', delay: 50 },
    { text: 'node_modules size: approaching singularity', color: '#ffaa00', delay: 50 }
  ],
  'misc-content': [
    { text: '> find ~/brain -name "*.random" -type f', color: '#00ff9d', delay: 300 },
    { text: '> 42069 files found', color: '#00ff9d', delay: 200 },
    { text: '[⚠] Coherence module not found', color: '#ff0000', delay: 200 },
    { text: '⟪※⟫⟪※⟫⟪※⟫ MISC PARTITION ⟪※⟫⟪※⟫⟪※⟫', color: '#ff00ff', delay: 100 },
    { text: '◉ /dev/urandom but for content', color: '#ff00ff', delay: 50 },
    { text: '◎ Digital artifacts of questionable value', color: '#fff', delay: 50 },
    { text: '◈ The overflow buffer of creativity', color: '#00ff9d', delay: 50 },
    { text: '◊ Basically my ~/Desktop folder energy', color: '#ffaa00', delay: 50 },
    { text: '⟪※⟫⟪※⟫⟪※⟫⟪※⟫⟪※⟫⟪※⟫⟪※⟫⟪※⟫', color: '#ff00ff', delay: 100 },
    { text: '', delay: 50 },
    { text: 'Contents may include:', color: '#fff', delay: 50 },
    { text: '- Half-baked ideas at 3am', color: '#00ff9d', delay: 50 },
    { text: '- Shower thoughts, documented', color: '#00ff9d', delay: 50 },
    { text: "- Things that don't fit elsewhere", color: '#00ff9d', delay: 50 },
    { text: '- Pure, unfiltered chaos', color: '#00ff9d', delay: 50 },
    { text: '', delay: 50 },
    { text: '¯\\_(⊙︿⊙)_/¯ embrace the entropy', color: '#ff00ff', delay: 50 }
  ]
};

export const useTypewriter = (container: React.RefObject<HTMLDivElement>, lines: TerminalLine[] | undefined, active: boolean, sectionId: string) => {
  React.useEffect(() => {
    if (!active || !lines || !container.current) return;
    const el = container.current;
    el.innerHTML = '';
    let cancelled = false;

    // Add typing class to hide content during typing
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add('typing-in-progress');
    }

    // Fallback: if nothing rendered after 800ms, dump full text instantly.
    const fallback = setTimeout(() => {
      if (cancelled) return;
      if (el.childElementCount === 0) {
        lines.forEach(line => {
          const lineDiv = document.createElement('div');
          lineDiv.className = 'terminal-line';
          lineDiv.style.color = line.color || '#00ff9d';
          if (line.text) {
            const timeSpan = document.createElement('span');
            timeSpan.style.color = '#00ffff';
            const now = new Date();
            timeSpan.textContent = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}] `;
            lineDiv.appendChild(timeSpan);
            const textSpan = document.createElement('span');
            textSpan.textContent = line.text;
            lineDiv.appendChild(textSpan);
          } else {
            lineDiv.innerHTML = '&nbsp;';
          }
          el.appendChild(lineDiv);
        });
        // Remove typing class after fallback
        if (section) {
          section.classList.remove('typing-in-progress');
        }
      }
    }, 800);

    (async () => {
      for (const line of lines) {
        if (cancelled) return;
        // Skip rendering completely for empty lines to avoid adding blank gaps.
        // We still respect the configured delay but do not insert any DOM node.
        if (!line.text) {
          await new Promise(r => setTimeout(r, line.delay));
          continue;
        }
        const lineDiv = document.createElement('div');
        lineDiv.className = 'terminal-line';
        lineDiv.style.color = line.color || '#00ff9d';
        const timeSpan = document.createElement('span');
        timeSpan.style.color = '#00ffff';
        const now = new Date();
        timeSpan.textContent = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}] `;
        lineDiv.appendChild(timeSpan);
        const textSpan = document.createElement('span');
        lineDiv.appendChild(textSpan);
        const cursor = document.createElement('span');
        cursor.textContent = '▋';
        cursor.style.animation = 'cursor-blink 1s infinite';
        lineDiv.appendChild(cursor);
        el.appendChild(lineDiv);
        for (let i = 0; i < line.text.length; i++) {
          if (cancelled) return;
          const ch = line.text[i];
          let delay = Math.random() * 3 + 3;
          if ('.!?,'.includes(ch)) delay += 10; else if (ch === ' ') delay += 3;
          if (Math.random() < 0.01) delay += Math.random() * 20;
          await new Promise(r => setTimeout(r, delay));
          textSpan.textContent += ch;
        }
        await new Promise(r => setTimeout(r, line.delay));
        cursor.remove();
      }
      clearTimeout(fallback);
      // Remove typing class after animation completes
      if (section) {
        section.classList.remove('typing-in-progress');
      }
    })();

    return () => { 
      cancelled = true; 
      clearTimeout(fallback); 
      // Cleanup: remove typing class
      if (section) {
        section.classList.remove('typing-in-progress');
      }
    };
  }, [active, lines, container, sectionId]);
};

export const TerminalLines: React.FC<{ sectionId: string }> = ({ sectionId }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { active } = useSection();
  const shouldType = active === sectionId;
  useTypewriter(ref, sectionTerminalContent[sectionId], shouldType, sectionId);
  return <div ref={ref} className="terminal-output" style={{ minHeight: 8 }} />;
};
