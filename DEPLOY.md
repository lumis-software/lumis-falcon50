# Deploying the Lumis Falcon Trainer

The app is a static PWA (Vite build → `dist/`). It runs fully offline in
**guest mode** with no backend. Cloud sync / per-pilot accounts activate later
once Supabase is connected (see `BACKEND_PLAN.md`).

This guide gets you a **private URL** to send to pilots today.

---

## Recommended: Vercel (free, fast, easy private access)

### One-time setup

1. Push this repo to GitHub (already on `github.com/lumis-software/lumis-falcon50`).
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Vercel auto-detects Vite. Confirm:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - (Both are also pinned in `vercel.json`.)
4. Click **Deploy**. You get a URL like `lumis-falcon50.vercel.app`.

### Make it private

Pick ONE of these:

**Option A — Soft access code (free, instant).**
In Vercel → Project → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `VITE_ACCESS_CODE` | a code you choose, e.g. `FALCON2026` |

Redeploy. Pilots must enter the code once on first open. _Note: this is a soft
gate (bundled in the app) — it deters casual access but is not strong security.
Real per-pilot login comes with Supabase (Phase 5)._

**Option B — Vercel password protection (server-side, stronger).**
Vercel → Project → **Settings → Deployment Protection → Password Protection**
(available on Pro, $20/mo). One shared password, enforced before the app loads.

**Option C — Just share the unlisted URL** and rely on it not being indexed.

### Updates

Every `git push` to `main` auto-deploys. Pilots' installed PWAs auto-update on
next launch (Workbox `autoUpdate`).

---

## Alternative: Netlify

1. [netlify.com](https://netlify.com) → **Add new site → Import from Git** → pick the repo.
2. Build command `npm run build`, publish directory `dist`.
3. SPA routing + headers come from `vercel.json` equivalents — Netlify reads
   `dist/_redirects` automatically; add one if needed:
   `/*  /index.html  200`
4. Private access: **Site settings → Access control → Password protection**
   (paid), or use the `VITE_ACCESS_CODE` env var as above.

---

## Custom domain (optional)

In Vercel/Netlify → **Domains**, add e.g. `trainer.lumis.com` and follow the
DNS instructions. HTTPS is automatic.

---

## Quick local check before deploying

```bash
npm install
npm run build
npm run preview   # serves the production build at http://localhost:4173
```

---

## What pilots do (install instructions)

Send them the URL plus:

- **iPhone / iPad:** open in **Safari** → Share → **Add to Home Screen**.
- **Mac (Safari 17+):** open the link → **File → Add to Dock**.
- **Windows / Android:** open in Chrome or Edge → **Install** icon in the address bar.

Works offline once installed.
