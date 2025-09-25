# nefas.tv

A vaporwave-inspired personal website (Next.js) with retro aesthetics, interactive sections, and a collection of assets and generated content.

## Quick summary

- Framework: Next.js (App Router)
- Languages: TypeScript + React
- Node: >= 18 (see `package.json`)
- Purpose: Personal/portfolio site with sections for visuals, photos, blog, music player, and small interactive demos.

## Project highlights

- App entry points: `app/layout.tsx` (root layout & metadata) and `app/page.tsx` (client-side preloader -> `LayoutShell`).
- Global styles are composed by `app/globals.css`, which imports legacy CSS files from `public/css/`.
- `public/` contains static assets (images, audio, css, artifacts). The site consumes JSON from `data/` for content like playlists, photos, posts and more.
- Several convenience scripts exist to generate content and thumbnails (see `package.json` scripts).

## Files & folders you should know

- `app/` - Next.js App Router pages and global CSS.
  - `layout.tsx` - Root layout, metadata and base font/background styles.
  - `page.tsx` - Top-level page, shows `Preloader` then `LayoutShell` (client component).
  - `globals.css` - Imports legacy CSS and adds a few base rules.
- `components/` - React components powering site sections (Header, Navigation, Preloader, LayoutShell, PhotoSection, VideoSection, WinampPlayer, etc.).
- `public/` - Static assets (images, audio, css, artifacts). Legacy static site files are kept here.
- `data/` - JSON content used by the site (posts, photos, playlist, 3D data, etc.).
- `types/` and `utils/` - Small helpers and types used across the app.
- `LEGACY_js/` - Legacy JavaScript from the original site.

## Important dependencies

- `next` (v14) — App Router and SSR/static site features.
- `react` / `react-dom` — UI library.
- `sharp` — Image processing for thumbnail generation (used by `generate-thumbnails-global.cjs` and related scripts).
- `@supabase/supabase-js` — Supabase client included as a dependency (check for environment usage in the codebase if you plan to integrate auth/storage).

See `package.json` for the complete list (dev and runtime deps).

## Scripts (from package.json)

- `npm run dev` — Run Next.js in development mode.
- `npm run build` — Build the production app.
- `npm run start` — Start the built Next.js app (after `build`).
- `npm run lint` — Run ESLint.
- `npm run typecheck` — Run TypeScript typecheck (`tsc --noEmit`).
- `npm run generate` — Runs `node generate-content.cjs` (project-specific content generation).
- `npm run playlist` — Runs `node generate-playlist.cjs`.
- `npm run thumbnails` — Runs `node generate-thumbnails-global.cjs` (uses `sharp`).

## Getting started (Windows / PowerShell)

Recommended Node version: >= 18. Install Node.js from the official installer or use nvm-windows.

1. Install dependencies

```powershell
npm install
```

2. Run development server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

3. Build & start production

```powershell
npm run build
npm run start
```

4. Optional: generate content or thumbnails

```powershell
npm run generate
npm run playlist
npm run thumbnails
```

Notes: the `thumbnails` script depends on `sharp`. If `sharp` fails to install or run on Windows, ensure your environment has a compatible Node.js version and try `npm rebuild sharp` or consult sharp's install suggestions.

## Development notes & tips

- The app uses the Next.js App Router — components in `app/` follow that pattern.
- `app/page.tsx` is a client component (it uses `"use client"`) and shows a `Preloader` before rendering the main `LayoutShell` with Suspense.
- Global CSS imports live in `app/globals.css` and pull in many legacy CSS files from `public/css/`. Consider incrementally migrating styles into component-scoped CSS modules or Tailwind/utility classes for maintainability.
- If you plan to use Supabase features (dependency present), search the codebase for `createClient` or `SUPABASE_` env var usage and add a `.env.local` with any required credentials.
- Image processing: `sharp` is powerful but native; if CI/build machines fail to install it, use a prebuilt environment or a container that has libvips available.

## Deployment

This is a standard Next.js app and can be deployed to platforms that support Next.js (Vercel, Netlify with adapters, DigitalOcean App Platform, Docker, etc.).

Quick Vercel notes:
- Vercel will automatically detect this repository as a Next.js project.
- Ensure Node version is compatible (>=18) via project settings or `engines` in `package.json`.

## Troubleshooting checklist

- Build errors: run `npm run typecheck` and `npm run lint` to catch type/lint issues early.
- `sharp` install issues: verify Node version, try `npm rebuild sharp`, or install on a Linux/macOS CI runner where libvips is available.
- Missing environment variables: check code for `process.env` usage, and add `.env.local` with required keys.

## Contributing

1. Fork and create a feature branch.
2. Run `npm install` and make sure `npm run dev` works locally.
3. Open a PR with a clear description and link to screenshots if UI changes were made.

## License

MIT (see `package.json`).

---

If you'd like, I can also:

- Add a minimal `.env.example` by scanning for `process.env` usages.
- Add a simple GitHub Actions workflow for CI that runs `npm ci && npm run build && npm run typecheck`.
- Add more detailed developer docs (component map, data shape examples) by parsing the `components/` and `data/` files.

Tell me which follow-up you'd like and I'll implement it.
