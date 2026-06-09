/**
 * Caution & Warning cross-reference.
 *
 * Goal: when a pilot sees an indication in the cockpit, know instantly what it
 * means, what to do, WHERE to look, and which system to study.
 *
 * The "warning" entries are grounded in the immediate-action memory items
 * extracted from the CAE handbook (their cues + bold-face actions). The
 * "caution"/"advisory" entries are standard Falcon 50 indication categories
 * mapped to the matching system lesson. This is a study cross-reference, not a
 * reproduction of a specific certified annunciator panel — legends, colours and
 * exact placement vary with airframe mod status. Drop the real panel image in
 * public/handbook/ and these can be pinned to the exact layout.
 */

export type Severity = "warning" | "caution" | "advisory";

export interface Annunciator {
  id: string;
  /** Legend / indication text as seen in the cockpit. */
  label: string;
  severity: Severity;
  /** Slug of the system lesson (route /learn/:slug) this associates with. */
  systemSlug: string;
  systemName: string;
  /** Where to look in the cockpit. */
  panel: string;
  /** What you see / hear. */
  see: string;
  /** What it means. */
  means: string;
  /** Immediate action or reference. */
  action: string;
  /** Title of a matching memory item (deep-link to Memory Items). */
  memoryRef?: string;
}

export const ANNUNCIATORS: Annunciator[] = [
  // ---- WARNINGS (red — immediate action) -------------------------------
  {
    id: "eng-fire",
    label: "ENG FIRE",
    severity: "warning",
    systemSlug: "powerplant",
    systemName: "Powerplant",
    panel: "Glareshield — illuminated FIRE PULL handle for the affected engine",
    see: "Red FIRE light in the engine's FIRE PULL handle + warning horn",
    means: "Fire/overheat detected in that engine's nacelle.",
    action:
      "Memory item: Warning horn — SILENCE, Power Lever — CUT-OFF, FIRE PULL — PULLED, then extinguisher. Land as soon as possible.",
    memoryRef: "Engine Fire In Flight",
  },
  {
    id: "apu-fire",
    label: "FIRE APU",
    severity: "warning",
    systemSlug: "apu",
    systemName: "APU",
    panel: "Glareshield / APU fire control",
    see: "FIRE APU light ON + warning horn",
    means: "Fire detected in the APU compartment.",
    action:
      "Memory item: APU — shut down and discharge the APU bottle per the bold-face procedure.",
    memoryRef: "APU Fire",
  },
  {
    id: "eng-fail",
    label: "ENG FAIL",
    severity: "warning",
    systemSlug: "powerplant",
    systemName: "Powerplant",
    panel: "Glareshield / engine instruments (N1, ITT) on the center panel",
    see: "Yaw toward the dead engine (ENG 1 or 3) or an ENG 2 FAIL light; spooling-down indications",
    means: "Loss of thrust on one engine.",
    action:
      "Maintain control with rudder, follow Engine Failure procedure (before/after V1 differs). Identify, verify, secure.",
    memoryRef: "Engine Failure During Takeoff — After V1",
  },
  {
    id: "all-eng-out",
    label: "ALL ENG OUT",
    severity: "warning",
    systemSlug: "powerplant",
    systemName: "Powerplant",
    panel: "Engine instruments + airspeed for relight envelope",
    see: "Loss of thrust on all engines, multiple parameters decaying",
    means: "All engines have failed — glide and relight situation.",
    action:
      "Memory item: establish glide speed, attempt relight, prepare for forced landing.",
    memoryRef: "All Engines Out",
  },
  {
    id: "cabin",
    label: "CABIN",
    severity: "warning",
    systemSlug: "environmental-pressurization",
    systemName: "Environmental / Pressurization",
    panel: "Overhead pressurization panel + cabin altimeter",
    see: "CABIN light ON / warning horn / cabin altitude climbing through ~10,000 ft",
    means: "Cabin altitude is too high — loss of pressurization.",
    action:
      "Memory item: oxygen masks ON, establish communications, descend; consider emergency descent.",
    memoryRef: "High Cabin Altitude / Slow Depressurization",
  },
  {
    id: "smoke",
    label: "SMOKE",
    severity: "warning",
    systemSlug: "environmental-pressurization",
    systemName: "Environmental / Pressurization",
    panel: "Air-conditioning outlets / cockpit + smoke procedure",
    see: "Smoke at the A/C outlets or in the cockpit/cabin",
    means: "Smoke or fumes in the environmental air or cabin.",
    action:
      "Memory item: crew oxygen / smoke masks, smoke removal procedure, isolate source.",
    memoryRef: "Smoke Removal / A/C Smoke",
  },
  {
    id: "rev-unlock",
    label: "REV UNLOCK",
    severity: "warning",
    systemSlug: "thrust-reverser",
    systemName: "Thrust Reverser",
    panel: "Center pedestal — reverser indication lights",
    see: "REV UNLOCK and possibly TRANSIT/DEPLOYED light, pitch-down moment, buffet/noise",
    means: "The thrust reverser is unlocked/deploying when it should be stowed.",
    action:
      "Memory item: control the airplane, reduce affected thrust, follow inadvertent reversal procedure.",
    memoryRef: "Inadvertent Flight Thrust Reversal",
  },
  {
    id: "three-gen",
    label: "GEN 1 · 2 · 3",
    severity: "warning",
    systemSlug: "electrical",
    systemName: "Electrical",
    panel: "Overhead electrical panel — GEN annunciators",
    see: "GEN 1, GEN 2 and GEN 3 lights all ON",
    means: "All three generators inoperative — on battery power only.",
    action:
      "Memory item: BUS TIE FLIGHT NORMAL, shed C/D bus loads, land ASAP (≈20 min battery).",
    memoryRef: "Three Generators Inop",
  },

  // ---- CAUTIONS (amber) ------------------------------------------------
  {
    id: "gen-single",
    label: "GEN",
    severity: "caution",
    systemSlug: "electrical",
    systemName: "Electrical",
    panel: "Overhead electrical panel — affected GEN light",
    see: "A single GEN light ON",
    means: "One generator is offline; remaining generators carry the load.",
    action:
      "Attempt one reset. If GEN 3 is lost, set BUS TIE — TIED to repower the Right Main; monitor loads (antiskid on B bus).",
  },
  {
    id: "hyd-lo",
    label: "HYD LO PR",
    severity: "caution",
    systemSlug: "hydraulics",
    systemName: "Hydraulics",
    panel: "Hydraulic gauges / annunciators (overhead + pedestal)",
    see: "Low-pressure indication on System 1 or System 2",
    means: "A hydraulic system has lost pressure (pump or fluid).",
    action:
      "Select the standby electric pump as required; expect degraded gear/brakes/surfaces on the affected system and use the alternate/emergency methods.",
  },
  {
    id: "bleed-ovht",
    label: "DUCT / BLEED",
    severity: "caution",
    systemSlug: "pneumatics-bleed-air",
    systemName: "Pneumatics / Bleed Air",
    panel: "Bleed-air panel — overheat / valve lights",
    see: "Bleed or duct overheat / valve disagreement light",
    means: "A bleed leak or overheat — risk to structure and to pressurization/anti-ice supply.",
    action:
      "Isolate the affected bleed source (close the bleed/iso valve) per the bleed-air procedure; expect loss of that side's bleed services.",
  },
  {
    id: "fuel-boost",
    label: "FUEL PR / BOOST",
    severity: "caution",
    systemSlug: "fuel",
    systemName: "Fuel",
    panel: "Overhead fuel panel — boost/transfer pump + low-pressure lights",
    see: "Boost-pump or fuel low-pressure light; transfer fault",
    means: "A fuel pump has failed or feed pressure is low; possible imbalance.",
    action:
      "Use crossfeed / remaining pumps to keep the engine fed and balance the wings; monitor the affected engine.",
  },
  {
    id: "lo-fuel",
    label: "LO FUEL",
    severity: "caution",
    systemSlug: "fuel",
    systemName: "Fuel",
    panel: "Fuel quantity gauges",
    see: "Low fuel level annunciation",
    means: "Useable fuel is approaching minimums in a tank.",
    action:
      "Cross-check quantity and time/range, plan an immediate diversion, and use crossfeed to balance.",
  },
  {
    id: "anti-ice",
    label: "ANTI-ICE",
    severity: "caution",
    systemSlug: "anti-ice-rain",
    systemName: "Anti-Ice & Rain",
    panel: "Overhead anti-ice panel — ENG / WING heat lights",
    see: "Engine or wing anti-ice disagreement / not-heating light",
    means: "An anti-ice zone is not protected as selected.",
    action:
      "Exit icing conditions if unable to restore protection; respect the no-ice/airspeed limitations.",
  },
  {
    id: "pitot",
    label: "PITOT HT",
    severity: "caution",
    systemSlug: "anti-ice-rain",
    systemName: "Anti-Ice & Rain",
    panel: "Overhead anti-ice panel — PITOT HEAT",
    see: "Pitot/static heat OFF or failed light",
    means: "Air-data probes are unheated — unreliable airspeed/altitude in icing.",
    action:
      "Turn pitot heat ON; if a probe stays unheated, treat the affected air-data as unreliable.",
  },

  // ---- ADVISORY / SAFE (blue/green) ------------------------------------
  {
    id: "gear-unsafe",
    label: "GEAR (red)",
    severity: "warning",
    systemSlug: "landing-gear-brakes",
    systemName: "Landing Gear & Brakes",
    panel: "Gear handle + three-green / red indicators",
    see: "Red light in the gear handle / a missing green — gear unsafe",
    means: "A gear is not down-and-locked (or not up-and-locked) as commanded.",
    action:
      "Recycle / confirm hydraulics; use the alternate (free-fall) gear extension; do not land without three green.",
  },
  {
    id: "ap-disc",
    label: "A/P · YD",
    severity: "advisory",
    systemSlug: "avionics",
    systemName: "Avionics",
    panel: "Glareshield mode annunciator / FMA",
    see: "A/P or yaw-damper disconnect tone and flag",
    means: "The autopilot or yaw damper has disengaged.",
    action:
      "Hand-fly, re-engage if appropriate; for repeated yaw-damper loss respect Dutch-roll / Mach limits.",
  },
];

export function annunciatorsForSystem(slug: string): Annunciator[] {
  return ANNUNCIATORS.filter((a) => a.systemSlug === slug);
}
