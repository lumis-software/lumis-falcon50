# Lumis Falcon Trainer — Roadmap

Status as of this push:

## ✅ Production-ready (FULL)

### Falcon 50 (base airframe)
- 9 interactive system schematics with click-for-info, failure scenarios, switch toggles, animated flow
- Audio walk-throughs for every system (Web Speech API)
- 18 procedures (Normal + Emergency Memory + Abnormal + Drill) in Procedure Trainer
- 164+ multiple-choice quiz questions
- Flashcards / Study Mode / Review Missed
- Memory Items with bold-face items
- Searchable Limitations (17 categories, 158 items)
- Live Flight Phases — 15 phases with synoptic display
- Falcon 50 silhouette (side + top view) with phase-driven visuals
- Checkride Oral Prep — 8 base + 8 F50-specific questions

### Multi-aircraft framework
- Aircraft selector at top of home
- Per-aircraft Differences view
- Profile + Logbook UI (localStorage)
- Lumis Smart Score integration point (stub — see BACKEND_PLAN.md)

## ⚠ Scaffolded (key differences captured; deep content for week-of fill)

### Falcon 50EX
- Spec card complete
- Engine deltas captured (-40 with DEEC vs. -3-1C)
- Avionics deltas captured (Pro Line 4 vs. EFIS-86)
- APU change captured (standard equipment)
- F-GLSA Vnukovo case study captured
- 3 oral exam questions
- **GAP — for the deep build:**
  - MZFW exact number from TCDS A46EU
  - APU in-flight start authorization (assume ground-only)
  - Total usable fuel capacity exact
  - Max cabin differential
  - Rudder control system specifics
  - Vfe values per flap setting, Mach trim envelope
  - Antiskid logic, brake cooling
  - Generator amperage / battery details
  - Full DEEC fault logic
  - Pro Line 4 page navigation tutorial

### Falcon 900 / 900B / 900C / 900EX (non-EASy)
- Spec card complete
- Two-system hydraulics architecture captured (different from F50)
- Engine variant breakdown (-5AR / -5BR / -60)
- Olympic 3838 + N823RC case studies captured
- 5 oral exam questions
- **GAP — for the deep build:**
  - MTOW/MLW/MZFW per variant
  - Per-tank fuel capacities + DX redesigned system details
  - APU model confirmation, exact limits
  - Anti-ice scheme details
  - PITCH FEEL system + Arthur unit deep dive
  - Steep approach training appendix content
  - Full procedures + memory items for 900 differences
  - Quiz questions for 900-specific systems

### Falcon 900EX EASy / DX / LX
- Spec card complete
- Type rating distinction (DA-EASY separate from DA-50) flagged prominently
- EASy II avionics overview
- Variant breakdown (EX EASy vs DX vs LX)
- 3 oral exam questions
- **GAP — for the deep build:**
  - Full EASy cockpit walkthrough (CCD, GFP, SVS, RAAS)
  - Autothrottle procedures
  - LX winglet performance differences
  - FalconEye HUD content
  - FMS-driven procedures
  - All DA-EASY checkride task content

## 📋 To do this week

### Content (week of June 9-15)
- [ ] Pull Falcon 50EX AFM Section 1 (limits) → fill scaffold gaps
- [ ] Pull Falcon 900B and 900EX AFMs → build out systems content
- [ ] Find or create EASy I/II cockpit panel reference imagery
- [ ] Add 50+ more F50EX quiz questions
- [ ] Add 80+ F900 quiz questions
- [ ] Add 60+ F900 EASy quiz questions
- [ ] Add 50EX-specific procedures (DEEC start logic, Pro Line 4 navigation)
- [ ] Add 900-specific procedures (two-system hyd failure logic, PITCH FEEL response)
- [ ] Add 900 EASy procedures (autothrottle disconnect, EASy I/II cockpit ops)
- [ ] Olympic 3838 detailed case study panel
- [ ] N823RC detailed case study panel

### Features (week of June 16+)
- [ ] Performance & W&B calculator (was scaffolded but deferred)
- [ ] More flight phases content (currently F50-centric)
- [ ] Per-aircraft Live Flight Phases (currently shared)
- [ ] Per-aircraft Procedure Trainer cockpit panels (50EX, 900 have different switch layouts)

### Backend (when ready)
- [ ] See BACKEND_PLAN.md
- [ ] Real auth (Supabase or Clerk)
- [ ] Profile + logbook sync to Lumis Smart Score
- [ ] Per-pilot completion tracking + reporting
- [ ] Admin dashboard for chief pilots to see crew progress

## ⚠ Legal / IP

Content is derived from publicly-available training material (CAE Falcon 50 Operating Handbook, FlightSafety Falcon 50 PTM Vol 2, FAA FSBR, Dassault marketing materials, Wikipedia, accident reports). For **commercial resale under the Lumis brand**, verify licensing with CAE / Dassault / FlightSafety. The current build is appropriate for internal pilot training and demo. Commercial sale requires legal review.

## Sources used

- CAE Falcon 50 Operating Handbook, Rev 1 Aug 2025 (uploaded)
- FlightSafety Falcon 50 Pilot Training Manual, Vol 2
- CAE Falcon 50/50EX Pilot Initial course outline
- FAA Flight Standardization Board Report DA-50/900 Rev 3 Draft
- Dassault Aviation 3-view drawings + Falcon 900LX datasheet
- airplanedriver.net (Eric Parks Falcon 50 study guide)
- code7700.com — N114TD case study (James Albright)
- Aviation Week N114TD coverage
- Aviation Pros — TFE731 and GTCP36 articles
- AOPA — Quick Look Falcon 900s
- Honeywell — Primus Epic Dassault EASy II product page
- Wikipedia — Dassault Falcon 50, 900, Olympic 3838
- NTSB / SKYbrary reports

---

— Lumis
