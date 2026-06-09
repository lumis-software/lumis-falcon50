import type { AnnotatedView } from "./AnnotatedDiagram";

/**
 * "Point & Learn" hotspot maps keyed by lesson id (the slugified system name).
 * Coordinates are in each view's viewBox units (top: 980×480, side: 980×360)
 * and line up with the shapes drawn in FalconViews.tsx.
 */
export const POINT_LEARN: Record<string, AnnotatedView> = {
  "flight-controls": {
    view: "top",
    caption: "Falcon 50 — control surfaces (plan view)",
    hotspots: [
      {
        id: "ailerons",
        part: "ailerons",
        x: 556,
        y: 175,
        label: "Ailerons",
        body: "Outboard trailing-edge surfaces give roll control. Hydraulically powered with artificial feel — there is no manual reversion, so control is lost only if the powering hydraulics fail.",
      },
      {
        id: "slats",
        part: "slats",
        x: 470,
        y: 150,
        label: "Leading-edge slats",
        body: "Full-span slats extend with the flaps to increase lift and lower stall speed for takeoff and landing.",
      },
      {
        id: "airbrakes",
        part: "airbrakes",
        x: 487,
        y: 160,
        label: "Airbrakes / spoilers",
        body: "Upper-wing panels raise to add drag for descent and slowing, and dump lift on touchdown to put weight on the wheels for braking.",
      },
      {
        id: "elevator",
        part: "elevator",
        x: 884,
        y: 185,
        label: "Elevators",
        body: "Trailing-edge surfaces on the horizontal stabilizer control pitch. Hydraulically actuated with artificial feel.",
      },
      {
        id: "rudder",
        part: "rudder",
        x: 814,
        y: 232,
        label: "Rudder",
        body: "Provides yaw control and is critical for directional control with an engine out. A yaw damper improves Dutch-roll damping.",
      },
      {
        id: "hstab",
        part: "hstab",
        x: 840,
        y: 188,
        label: "Stabilizer / Mach trim",
        body: "The horizontal stabilizer is trimmable. Mach trim automatically adjusts pitch trim between 0.78–0.89 M to counter Mach tuck.",
      },
    ],
  },

  "landing-gear-brakes": {
    view: "side",
    caption: "Falcon 50 — landing gear (side view, gear down)",
    hotspots: [
      {
        id: "gearNose",
        part: "gearNose",
        x: 190,
        y: 312,
        label: "Nose gear & steering",
        body: "Hydraulically actuated nose gear retracts forward. Nosewheel steering is hydraulic, commanded through the rudder pedals / tiller.",
      },
      {
        id: "gearMain",
        part: "gearMain",
        x: 460,
        y: 320,
        label: "Main landing gear",
        body: "Two main legs retract inboard. A green light for each strut (three green) confirms all gear down and locked.",
      },
      {
        id: "brakes",
        part: "gearMain",
        x: 512,
        y: 320,
        label: "Brakes & antiskid",
        body: "Multi-disc main-wheel brakes with antiskid protection. An emergency / parking brake provides braking if the normal system is lost — modulate manually with antiskid inoperative.",
      },
    ],
  },

  "anti-ice-rain": {
    view: "side",
    caption: "Falcon 50 — ice protection zones",
    hotspots: [
      {
        id: "windshield",
        part: "windshield",
        x: 165,
        y: 182,
        label: "Windshield heat",
        body: "Electrically heated windshield prevents icing and fogging and adds bird-strike resistance.",
      },
      {
        id: "probes",
        x: 215,
        y: 205,
        label: "Pitot / static probes",
        body: "Electrically heated probes keep airspeed, altitude, and AOA data accurate in icing conditions.",
      },
      {
        id: "wingai",
        part: "slats",
        x: 372,
        y: 210,
        label: "Wing leading-edge anti-ice",
        body: "Engine bleed air heats the wing/slat leading edges to keep the lifting surfaces clear of ice.",
      },
      {
        id: "engai",
        part: "eng3",
        x: 750,
        y: 135,
        label: "Engine inlet anti-ice",
        body: "Bleed air protects the intakes of all three engines from ice that could be ingested and damage the fans.",
      },
    ],
  },

  fuel: {
    view: "top",
    caption: "Falcon 50 — fuel tanks & feed (plan view)",
    hotspots: [
      {
        id: "tankL",
        part: "tankL",
        x: 500,
        y: 150,
        label: "Left wing tank",
        body: "Feeds the left engine. Boost pumps deliver fuel; wing tanks can be interconnected for transfer and balancing.",
      },
      {
        id: "tankC",
        part: "tankC",
        x: 490,
        y: 240,
        label: "Center (fuselage) tank",
        body: "Holds the largest fuel load and transfers into the wing tanks, which in turn feed the engines.",
      },
      {
        id: "tankR",
        part: "tankR",
        x: 500,
        y: 330,
        label: "Right wing tank",
        body: "Feeds the right engine. Keep left/right balanced — an imbalance affects roll trim and is limited by the AFM.",
      },
      {
        id: "feed",
        part: "eng3",
        x: 730,
        y: 240,
        label: "Engine feed & crossfeed",
        body: "Boost pumps feed each engine. Crossfeed lets any tank feed any engine for balancing or after an engine failure.",
      },
    ],
  },

  powerplant: {
    view: "top",
    caption: "Falcon 50 — three TFE731 engines + APU",
    hotspots: [
      {
        id: "eng1",
        part: "eng1",
        x: 740,
        y: 199,
        label: "Engine 1 (left)",
        body: "Honeywell/Garrett TFE731-3 turbofan, ~3,700 lbf, mounted on the rear fuselage. Each engine drives one hydraulic system and one generator.",
      },
      {
        id: "eng2",
        part: "eng2",
        x: 740,
        y: 281,
        label: "Engine 2 (right)",
        body: "Right rear-fuselage TFE731-3. Engine/system pairing matters for failure analysis — losing an engine also affects its hydraulic and electrical sources.",
      },
      {
        id: "eng3",
        part: "eng3",
        x: 712,
        y: 240,
        label: "Engine 3 (center, S-duct)",
        body: "The signature third engine is fed by an S-duct with its intake at the base of the vertical fin and the tailpipe on the centerline.",
      },
      {
        id: "apu",
        part: "apu",
        x: 846,
        y: 240,
        label: "APU (tailcone)",
        body: "The auxiliary power unit supplies electrical power and bleed air on the ground for engine start and air conditioning (where installed).",
      },
    ],
  },

  hydraulics: {
    view: "top",
    caption: "Falcon 50 — hydraulic power sources & users",
    hotspots: [
      {
        id: "pump1",
        part: "eng1",
        x: 740,
        y: 199,
        label: "System 1 pump (LH engine)",
        body: "An engine-driven pump on the left engine pressurizes System 1 (~3000 psi). System 1 powers the primary flight controls, normal gear and normal brakes.",
      },
      {
        id: "pump2",
        part: "eng2",
        x: 740,
        y: 281,
        label: "System 2 pump (RH engine)",
        body: "An engine-driven pump on the right engine pressurizes System 2. The two systems work in parallel on the flight controls so a single failure does not lose control.",
      },
      {
        id: "pumpC",
        part: "eng3",
        x: 712,
        y: 240,
        label: "Center-engine pump",
        body: "The center engine drives an additional pump feeding the systems, improving redundancy with all three engines running.",
      },
      {
        id: "stby",
        part: "fuselage",
        x: 360,
        y: 240,
        label: "Standby electric pump & accumulators",
        body: "An electric standby pump backs up the engine pumps, and accumulators store pressure for brakes and the thrust reverser. The standby pump also gives ground hydraulic power without engines running.",
      },
      {
        id: "users",
        part: "ailerons",
        x: 556,
        y: 175,
        label: "What hydraulics drive",
        body: "Flight controls (ailerons, elevators, rudder), slats/flaps and airbrakes, landing gear, brakes, nosewheel steering and the thrust reverser are all hydraulically powered — there is no manual reversion.",
      },
    ],
  },

  electrical: {
    view: "top",
    caption: "Falcon 50 — electrical generation & distribution",
    hotspots: [
      {
        id: "gen1",
        part: "eng1",
        x: 740,
        y: 199,
        label: "Generator 1 (LH engine)",
        body: "Each engine drives a starter-generator supplying 28 V DC. Generator 1 feeds the left main bus. Any single generator can carry the essential loads.",
      },
      {
        id: "gen2",
        part: "eng2",
        x: 740,
        y: 281,
        label: "Generator 2 (RH engine)",
        body: "The right engine's generator feeds the right main bus. Bus ties allow a remaining generator to power both sides after a failure.",
      },
      {
        id: "apugen",
        part: "apu",
        x: 846,
        y: 240,
        label: "APU generator",
        body: "The APU generator provides electrical power on the ground and, depending on installation, as an in-flight backup — useful for engine start and to keep buses powered.",
      },
      {
        id: "batt",
        part: "fuselage",
        x: 150,
        y: 240,
        label: "Batteries",
        body: "Nicad/lead-acid batteries provide start power and an emergency source. On battery only, a load-shed essential bus keeps flight-critical equipment alive for a limited time.",
      },
      {
        id: "buses",
        part: "fuselage",
        x: 360,
        y: 240,
        label: "Main & essential buses",
        body: "Power is distributed through main buses to an essential/emergency bus that retains the most critical avionics and instruments after multiple failures.",
      },
    ],
  },

  "pneumatics-bleed-air": {
    view: "top",
    caption: "Falcon 50 — bleed air sources & users",
    hotspots: [
      {
        id: "bleed1",
        part: "eng1",
        x: 740,
        y: 199,
        label: "Engine bleed (LH)",
        body: "Hot, high-pressure air is tapped from the engine compressors. Each engine is a bleed source feeding a common manifold.",
      },
      {
        id: "bleed2",
        part: "eng2",
        x: 740,
        y: 281,
        label: "Engine bleed (RH)",
        body: "Bleed from the right engine joins the manifold. A crossbleed/isolation valve lets one engine supply the whole system — important for cross-bleed starts.",
      },
      {
        id: "manifold",
        part: "fuselage",
        x: 360,
        y: 240,
        label: "Manifold & isolation valve",
        body: "Pressure-regulating and isolation valves control flow into the manifold that feeds pressurization, air conditioning and anti-ice. Overheat/leak detection protects the structure.",
      },
      {
        id: "wing",
        part: "slats",
        x: 470,
        y: 150,
        label: "Wing & cowl anti-ice",
        body: "Bleed air heats the wing/slat leading edges and engine inlets to prevent ice build-up.",
      },
      {
        id: "packs",
        part: "tankC",
        x: 490,
        y: 240,
        label: "Packs / pressurization feed",
        body: "Conditioned bleed air supplies the air-conditioning packs and pressurizes the cabin via the environmental system.",
      },
    ],
  },

  "environmental-pressurization": {
    view: "side",
    caption: "Falcon 50 — pressurization & air conditioning",
    hotspots: [
      {
        id: "source",
        part: "eng3",
        x: 750,
        y: 150,
        label: "Bleed-air source",
        body: "Engine (or APU) bleed air is the source for both cabin pressurization and air conditioning.",
      },
      {
        id: "packs",
        part: "wing",
        x: 460,
        y: 214,
        label: "Air-conditioning packs",
        body: "Packs cool and condition the hot bleed air before it enters the cabin, mixing to maintain a comfortable temperature.",
      },
      {
        id: "cabin",
        part: "fuselage",
        x: 360,
        y: 190,
        label: "Pressurized cabin",
        body: "The cabin is pressurized to keep cabin altitude low. Maximum differential pressure (≈8.8 psi) gives a comfortable cabin altitude at the certified ceiling.",
      },
      {
        id: "outflow",
        part: "fuselage",
        x: 690,
        y: 200,
        label: "Outflow valve",
        body: "The outflow valve in the aft fuselage controls how fast air leaves, setting cabin altitude and rate. Safety/relief valves prevent over-pressurization.",
      },
    ],
  },

  "thrust-reverser": {
    view: "side",
    caption: "Falcon 50 — thrust reverser (center engine)",
    hotspots: [
      {
        id: "tr",
        part: "eng3",
        x: 770,
        y: 195,
        label: "Reverser (center engine)",
        body: "The thrust reverser is fitted to the center engine. When deployed on landing it redirects exhaust forward to help decelerate, reducing brake wear.",
      },
      {
        id: "interlock",
        part: "gearMain",
        x: 460,
        y: 320,
        label: "Ground / squat interlock",
        body: "Deployment is inhibited until weight-on-wheels (and other interlocks) are satisfied, so the reverser can only be selected on the ground.",
      },
      {
        id: "control",
        part: "fuselage",
        x: 300,
        y: 188,
        label: "Cockpit control & stow",
        body: "Reverse is commanded with the levers after touchdown and must be stowed by a set speed during the rollout. An unsafe/unlocked indication requires the appropriate checklist.",
      },
    ],
  },
};

// APU lesson shares the powerplant view.
POINT_LEARN["apu"] = POINT_LEARN["powerplant"];

export function getAnnotatedView(lessonId: string): AnnotatedView | undefined {
  return POINT_LEARN[lessonId];
}
