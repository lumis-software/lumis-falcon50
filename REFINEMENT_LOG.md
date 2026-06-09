# Overnight Refinement Log

Running log of the autonomous "make the visuals teach like an instructor"
session. Newest entries at the top. Live app:
`https://lumis-software.github.io/lumis-falcon50/`

---

## Session — visual fidelity + guided teaching

**Goal from you:** make the visual systems/diagrams more sophisticated, base
them on the POH/CAE cutaways, study what better software (CPaT/CAE) does, and
iterate toward a pre-courseware / "instructor replacement" feel.

### What I studied first
- **Our own CAE cutaways** (`public/handbook/*.png`) are the gold standard:
  color-coded by system + a legend, every component labeled with leader lines,
  and the fuel one is a wing **cutaway** (spatial + schematic in one). That set
  the direction: consistent color-coding, legends, labeled components, and
  "point at the part" spatial views.
- **Competitor approach (CPaT/CAE):** Demo → Practice → Perform progression,
  hands-free narrated walkthroughs, 2D "SmartGraphics" with color states, and
  microlessons. We now mirror Demo (guided tour) + Knowledge Check, and I'm
  adding Practice (find-the-part).
- **Legacy app find:** the original had a detailed, animated metallic Falcon
  side/top view (gear/flaps/slats/engines/lights/reverser) that we never ported.

> Note on copyright: I did **not** scrape/embed third-party Falcon 50 or CAE
> POH cutaways from the web. I used the CAE diagrams already in the app (your
> reference) and built original artwork in that style. If you have a licensed
> POH cutaway file you want traced, drop it in `public/handbook/` and I'll base
> a higher-detail cross-section on it.

### Shipped this session (each is its own commit, already deployed)
1. **Hands-free Guided Tour (Demo mode)** on every Point & Learn diagram — it
   highlights each part, narrates it, and auto-advances when narration ends
   (timed fallback if speech is off). Part counter, pause, manual stepping.
2. **Animated Falcon restored in Live Flight Phases** — ported the detailed
   legacy side/top views; they read the existing flight state so the aircraft
   now animates through every phase (gear, flaps/slats, engine spool, lights).
   Side/Top toggle.
3. **Metallic gradient shading** on the Point & Learn artwork (fuselage, wings,
   surfaces, engines) for depth instead of flat fills; selected part glows amber.
4. **Point & Learn now covers all systems** — added annotated hotspot maps for
   electrical, hydraulics, bleed air, pressurization, and the thrust reverser
   (previously only flight controls / gear / anti-ice / fuel / powerplant).
5. **Practice mode ("find the part")** — the diagram asks you to tap the right
   component, scores you across all parts in random order, and gives instant
   correct/incorrect feedback. This is the CPaT "Practice" stage of
   Demo → Practice → Knowledge Check.
6. **Soft depth shadow** on the airframe artwork for a premium, 3-D feel.
7. **Caution & Warning cross-reference** (new "Caution & Warning" mode) — a
   simulated annunciator panel of colour-coded lights; tap one to see *what you
   see/hear → what it means → what to do → where to look (panel) → open that
   system's diagram*. Warnings are grounded in the real bold-face memory items
   (cues + actions); cautions are standard Falcon 50 categories mapped to
   systems. Each system diagram now also lists its **Related cockpit
   indications** as chips that deep-link into this reference.
   - **No exact annunciator-panel layout exists in the extracted reference**, so
     this is a study cross-reference. Drop the real annunciator photo/diagram in
     `public/handbook/` and I'll pin it to the exact layout and colours.

### Tooling added (dev-only, for self-review)
- `scripts/render-falcon.mjs` — renders the artwork to PNG via the TypeScript
  transpiler (Vite 8 dropped esbuild) so I can visually check changes.
- `scripts/render-annotated.mjs` — renders a system's view + numbered markers
  to verify hotspot placement on the airframe.
- `scripts/extract-aircraft.mjs` — lifts the legacy animated views into
  `src/features/phases/aircraftView.js`.

### Next ideas (queued for continued refinement)
- **Color-coded schematic legend**: overlay a small legend on the interactive
  schematics matching the CAE color language (sys 1 / sys 2 / supply / electric).
- **Higher-detail cross-sections**: a true wing/fuselage cutaway (like the CAE
  fuel diagram) for fuel, hydraulics, and pressurization flow.
- **Improved airframe accuracy**: nudge wing position and engine pods to better
  match Falcon 50 proportions; add panel lines for realism.
- **Cockpit panel view**: clickable panel with control locations for flows.
- **Lesson-level guided tour**: auto-play overview → diagram tour → check.
