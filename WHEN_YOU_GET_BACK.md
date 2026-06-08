# Welcome back, Steve

Here's exactly what happened while you were at dinner, what's ready, and the **two minutes of work** you need to do to ship it.

## ✅ Done while you were out

### App content
- **Lumis rebrand applied to the source** (was only in the offline copy before)
- **Multi-aircraft framework built** — aircraft picker at top of home, switches between Falcon 50, 50EX, 900, and 900 EASy
- **Falcon 50 stays at FULL coverage** — all 9 interactive systems, 18 procedures, 164 questions, audio walk-throughs, phases, trainer
- **Falcon 50EX scaffolded** — full spec card, three key deltas (DEEC-controlled -40 engines, Pro Line 4 cockpit, APU standard), F-GLSA Vnukovo case study, 3 oral exam questions
- **Falcon 900 scaffolded** — full spec card, two-system hydraulics architecture explained (different from F50), engine variants (-5/-60), **Olympic 3838 case study** (the 900-family equivalent of N114TD), 5 oral questions
- **Falcon 900 EASy scaffolded** — DA-EASY separate type rating flagged prominently, EASy cockpit overview, 900EX/DX/LX variant breakdown, N823RC MYF case study
- **New "Checkride Oral Prep" mode** — 8 shared regs/aero/weather questions + per-aircraft systems questions with model answers. Filter by All / Shared / Aircraft-specific
- **New "Profile & Logbook" mode** — sign-in fields (name, email, phone, certs, ratings, hours), logbook with manual entry + CSV bulk import, **Lumis Smart Score sync stub** (currently logs to console; wire to real API when backend is up)
- **New "Aircraft Differences & Specs" mode** — per-aircraft spec card + differences sections + accident case studies

### Architecture / docs
- **BACKEND_PLAN.md** in repo — exact Supabase schema, API contract for Smart Score, migration path from localStorage mockup → real SaaS. ~1 week of dev work when you're ready.
- **ROADMAP.md** in repo — what's deep vs. scaffolded per aircraft, week-of follow-up list, legal/IP note
- **WHEN_YOU_GET_BACK.md** ← this file
- **Offline file rebuilt** at `Falcon_50_Study_App_Offline.html` (1.38 MB now — includes all new modes) — works without internet
- **Mirror to Desktop folder** done for both PWA folder and standalone offline file
- **Source HTML at Falcon_50_Study_App.html updated** with all changes (5,059 lines, 713 KB) — Babel parse verified clean

### Research
- Falcon 50EX + 900 deep research report captured (see `RESEARCH_F50EX_F900.md` if I had time — otherwise embedded in the scaffolded content + ROADMAP gaps)
- Sources: FAA FSBR DA-50/900, Wikipedia, Jet Advisors, AOPA, Dassault, FlightSafety, Honeywell, accident reports

## ⏳ Pending: GitHub Pages URL

I enabled Pages earlier and you saved the source = main / root. The URL `https://lumis-software.github.io/lumis-falcon50/` is still returning empty as of the last check — this either means:
1. The build is still in progress (normal for first push, can take 10+ minutes)
2. There's a build error showing in the Actions tab

**Check status:** `https://github.com/lumis-software/lumis-falcon50/actions` — should show a successful "pages build and deployment" workflow.

If the URL still 404s after 15 minutes, the most likely fix is in Settings → Pages → re-save the source (sometimes the first save doesn't trigger a build).

## 🎯 The 2-minute close-out — DO THIS WHEN YOU'RE BACK

### Step 1: Clear the .git lock file (15 sec)

The sandbox left a stale `.git/index.lock` file that blocks commits. Easiest fix:

1. Open **Finder** → navigate to `Documents/Claude/Projects/GB Airlink/Lumis_Falcon50_PWA`
2. Press **⌘+Shift+. (period)** to show hidden files
3. Open the **.git** folder (faded folder icon)
4. Find **index.lock** (small file, 0 bytes) → drag it to Trash
5. Also find **_lock_old** if present → drag to Trash
6. Press ⌘+Shift+. again to hide hidden files

### Step 2: Push via GitHub Desktop (60 sec)

1. Open **GitHub Desktop**
2. Top-left: click **"Current Repository"** dropdown → select **`lumis-falcon50`** (under `lumis-software`)
3. You'll see 3 changes: `index.html` modified, plus `BACKEND_PLAN.md` and `ROADMAP.md` new files
4. Bottom-left commit box → Summary: `Multi-aircraft framework: F50EX + 900 scaffolds, Checkride Oral Prep, Profile/Logbook, Lumis rebrand`
5. Click **"Commit to main"**
6. Top of window: click **"Push origin"**

GitHub Pages will rebuild and deploy within ~60 seconds.

### Step 3: Verify + send to pilots

1. Open `https://lumis-software.github.io/lumis-falcon50/` in Safari
2. You should see the LUMIS — Falcon Training home with aircraft picker at top
3. Tap **Profile & Logbook** → enter your details → tap "Sync to Lumis Smart Score" (will say SIMULATED — that's correct until backend is wired)
4. Switch to **Falcon 50EX** in the picker → tap **Aircraft Differences & Specs** → verify content loads
5. If everything looks right, send this to your pilots:

```
Lumis Falcon Training App — install on your iPad/phone/laptop

I've built a multi-aircraft training app covering Falcon 50, 50EX,
and the 900 family. Interactive systems schematics with failure
scenarios, ~165 quiz questions, memory items, audio walk-throughs of
every system, full procedure trainer, live flight phases visualizer,
and a Checkride Oral Prep mode with examiner-style questions and
model answers. Set up your profile and logbook in-app — Smart Score
sync coming soon.

LINK: https://lumis-software.github.io/lumis-falcon50/

INSTALL:

iPad / iPhone
  • Open the LINK in Safari (must be Safari)
  • Tap Share → "Add to Home Screen" → Add
  • Tap the Lumis icon on your home screen

Mac (Sonoma 14+)
  • Open the LINK in Safari → File menu → "Add to Dock"

Windows / older Mac
  • Open the LINK in Edge or Chrome
  • Click the install icon in the address bar

Works offline once installed. Send feedback to Steve.

— Lumis
```

## 🗓 This week (when you have time)

See ROADMAP.md for the full list. Highest priorities:
1. Pull Falcon 50EX AFM Section 1 (limits) → fill the GAP entries in the 50EX content
2. Pull Falcon 900B and 900EX AFMs → build out 900 systems content
3. Add full quiz banks for 50EX and 900 (currently 0 questions, just oral)
4. Build out per-aircraft procedures + memory items
5. When ready for SaaS: follow BACKEND_PLAN.md to wire Supabase + Lumis Smart Score

## ⚠ Legal heads-up (one more time)

Content is derived from publicly-available training material. For **commercial resale under Lumis**, get licensing review from CAE / Dassault / FlightSafety before scaling beyond demo / internal use. The current build is fine for showing to your pilots and prospective customers, but generating revenue from CAE-derived content invites a cease-and-desist letter.

Enjoy dinner with Stormy. Everything else can wait until you're rested.

— Claude
