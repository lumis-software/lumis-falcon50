# Lumis Falcon Trainer

A multi-aircraft pilot study, testing, and proficiency PWA for the Dassault
Falcon family (Falcon 50 today; 50EX / 900 / 900 EASy expanding). Installable,
works fully offline, with cloud sync and per-pilot accounts on the roadmap.

## Tech stack

- **Vite 8 + React 19 + TypeScript** — fast, typed, maintainable.
- **Tailwind v4** design system (`src/index.css` + `src/components/ui`).
- **vite-plugin-pwa** (Workbox) — offline precache + auto-update.
- **Supabase** (Auth + Postgres + RLS) — wired via env when provisioned; the
  app runs in local guest mode until then.
- **Zustand** — persisted study progress and trainer completion.

## Study modes

Quiz · Study (flashcards) · Review Missed · Memory Items · Limitations
(searchable) · Systems reference · Procedure Trainer (guided) · Live Flight
Phases (synoptic systems display) · Procedures · Checkride Oral Prep
(aircraft-aware) · Differences & Specs.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
```

Copy `.env.example` to `.env` to configure the backend / access code (all
optional — the app runs without any of them).

## Project layout

```
src/
  components/   design-system UI + layout
  data/         typed content modules (raw/ = extracted from legacy app)
  features/     one folder per study mode
  providers/    Auth, Aircraft, AccessGate context
  state/        Zustand stores (progress, trainer)
  types/        content + auth types
  lib/          supabase client, helpers
scripts/        extract-content.mjs (legacy → typed data)
legacy/         original single-file app, preserved
```

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for getting a private URL to pilots.

## Disclaimer

Training aid only. Always refer to the AFM and your operator's current company
manuals for actual operations. Content is derived from publicly available
training material; verify licensing before commercial resale (see `ROADMAP.md`).

---

© Lumis. All rights reserved.
