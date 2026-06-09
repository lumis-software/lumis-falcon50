/**
 * Recognizable Falcon 50 artwork as highlightable SVG part-groups.
 *
 * The Falcon 50 is a three-engine business jet: two fuselage-mounted engines
 * plus a center engine fed by an S-duct at the base of the swept vertical fin,
 * a low swept wing, and a low-set horizontal stabilizer. These are stylized but
 * proportionally faithful schematics meant for teaching component locations.
 *
 * Each annotatable part carries an `id`; passing `highlight={id}` recolors that
 * part (amber + glow) so a tapped hotspot lights up the real component.
 */

const BODY = "url(#acBody)";
const WING = "url(#acWing)";
const BODY_STROKE = "#6b7d99";
const SURF = "url(#acSurf)";
const SURF_STROKE = "#7d8fab";
const ENGINE = "url(#acEng)";
const ACCENT = "#f59e0b";

function fill(id: string, highlight: string | undefined, base: string): string {
  return highlight === id ? ACCENT : base;
}
function cls(id: string, highlight: string | undefined): string {
  return highlight === id ? "comp-sel" : "";
}

/** Shared gradient/shadow defs. Only one view is ever mounted per <svg>. */
function AcDefs() {
  return (
    <defs>
      <linearGradient id="acBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3a4d6b" />
        <stop offset="42%" stopColor="#223149" />
        <stop offset="100%" stopColor="#0e1828" />
      </linearGradient>
      <linearGradient id="acWing" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#31435f" />
        <stop offset="100%" stopColor="#15223a" />
      </linearGradient>
      <linearGradient id="acSurf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#43577a" />
        <stop offset="100%" stopColor="#293b57" />
      </linearGradient>
      <linearGradient id="acEng" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#243250" />
        <stop offset="50%" stopColor="#0d1526" />
        <stop offset="100%" stopColor="#05090f" />
      </linearGradient>
      <filter id="acShadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow
          dx="0"
          dy="6"
          stdDeviation="7"
          floodColor="#000000"
          floodOpacity="0.45"
        />
      </filter>
    </defs>
  );
}

export const TOP_VIEW = { viewBox: "0 0 980 480" };
export const SIDE_VIEW = { viewBox: "0 0 980 360" };

/* ---------------------------------------------------------------- TOP VIEW */
export function FalconTopView({ highlight }: { highlight?: string }) {
  const h = highlight;
  return (
    <g>
      <AcDefs />
      <g filter="url(#acShadow)">
      {/* Wings (low, swept) */}
      <g className={cls("wing", h)}>
        <polygon
          points="430,228 520,72 566,72 545,228"
          fill={fill("wing", h, WING)}
          stroke={BODY_STROKE}
          strokeWidth="1.5"
        />
        <polygon
          points="430,252 545,252 566,408 520,408"
          fill={fill("wing", h, WING)}
          stroke={BODY_STROKE}
          strokeWidth="1.5"
        />
      </g>

      {/* Leading-edge slats */}
      <g className={cls("slats", h)}>
        <polygon
          points="430,228 520,72 528,74 442,228"
          fill={fill("slats", h, SURF)}
          stroke={SURF_STROKE}
          strokeWidth="1"
        />
        <polygon
          points="430,252 442,252 528,406 520,408"
          fill={fill("slats", h, SURF)}
          stroke={SURF_STROKE}
          strokeWidth="1"
        />
      </g>

      {/* Airbrakes (upper wing surface, inboard) */}
      <g className={cls("airbrakes", h)}>
        <rect x="470" y="150" width="34" height="20" rx="2" transform="rotate(-58 487 160)" fill={fill("airbrakes", h, "#3b5170")} stroke={SURF_STROKE} />
        <rect x="470" y="310" width="34" height="20" rx="2" transform="rotate(58 487 320)" fill={fill("airbrakes", h, "#3b5170")} stroke={SURF_STROKE} />
      </g>

      {/* Ailerons (outboard trailing edge) */}
      <g className={cls("ailerons", h)}>
        <polygon points="545,150 566,150 560,200 541,200" fill={fill("ailerons", h, SURF)} stroke={SURF_STROKE} />
        <polygon points="541,280 560,280 566,330 545,330" fill={fill("ailerons", h, SURF)} stroke={SURF_STROKE} />
      </g>

      {/* Wing fuel tanks */}
      <g className={cls("tankL", h)}>
        <polygon points="455,210 525,110 548,118 520,212" fill={fill("tankL", h, "#1d3a5c")} stroke="#3f6da0" strokeDasharray="3 2" />
      </g>
      <g className={cls("tankR", h)}>
        <polygon points="455,270 520,268 548,362 525,370" fill={fill("tankR", h, "#1d3a5c")} stroke="#3f6da0" strokeDasharray="3 2" />
      </g>

      {/* Fuselage */}
      <path
        d="M40,240 C90,212 150,206 220,205 L700,210 C760,212 800,220 840,232 C852,236 852,244 840,248 C800,260 760,268 700,270 L220,275 C150,274 90,268 40,240 Z"
        fill={fill("fuselage", h, BODY)}
        stroke={BODY_STROKE}
        strokeWidth="2"
        className={cls("fuselage", h)}
      />
      {/* Center / fuselage fuel tank */}
      <rect x="430" y="224" width="120" height="32" rx="6" fill={fill("tankC", h, "#1d3a5c")} stroke="#3f6da0" strokeDasharray="3 2" className={cls("tankC", h)} />
      {/* Cockpit */}
      <path d="M120,224 C150,218 180,217 210,218 L210,262 C180,263 150,262 120,256 Z" fill="#0e1828" stroke={BODY_STROKE} />
      <circle cx="150" cy="240" r="5" fill="#2b3c57" />

      {/* Nose gear + main gear (stowed positions) */}
      <g className={cls("gearNose", h)}>
        <rect x="232" y="232" width="16" height="16" rx="3" fill={fill("gearNose", h, "#0d1526")} stroke="#8aa0c0" />
      </g>
      <g className={cls("gearMain", h)}>
        <rect x="430" y="214" width="16" height="14" rx="3" fill={fill("gearMain", h, "#0d1526")} stroke="#8aa0c0" />
        <rect x="430" y="252" width="16" height="14" rx="3" fill={fill("gearMain", h, "#0d1526")} stroke="#8aa0c0" />
      </g>

      {/* Pylons connecting side engines to the rear fuselage */}
      <polygon points="678,214 712,214 706,202 686,202" fill={BODY} stroke={BODY_STROKE} />
      <polygon points="678,266 712,266 706,278 686,278" fill={BODY} stroke={BODY_STROKE} />

      {/* Side engines (1 = left/upper, 2 = right/lower) */}
      <g className={cls("eng1", h)}>
        <rect x="672" y="182" width="116" height="30" rx="14" fill={fill("eng1", h, ENGINE)} stroke="#7c8aa3" strokeWidth="1.5" />
        <circle cx="788" cy="197" r="6" fill="#243044" />
      </g>
      <g className={cls("eng2", h)}>
        <rect x="672" y="268" width="116" height="30" rx="14" fill={fill("eng2", h, ENGINE)} stroke="#7c8aa3" strokeWidth="1.5" />
        <circle cx="788" cy="283" r="6" fill="#243044" />
      </g>
      {/* Center engine 3 (S-duct intake + tailpipe on centerline) */}
      <g className={cls("eng3", h)}>
        <path d="M700,232 L770,236 L860,238 L860,242 L770,244 L700,248 Z" fill={fill("eng3", h, ENGINE)} stroke="#7c8aa3" strokeWidth="1.5" />
        <ellipse cx="712" cy="240" rx="10" ry="11" fill="#162133" stroke="#7c8aa3" />
      </g>

      {/* Vertical fin (edge-on) + rudder */}
      <polygon points="700,238 800,236 800,244 700,242" fill="#243044" stroke={BODY_STROKE} />
      <g className={cls("rudder", h)}>
        <polygon points="800,237 836,239 836,241 800,243" fill={fill("rudder", h, SURF)} stroke={SURF_STROKE} />
      </g>

      {/* Horizontal stabilizer + elevators */}
      <g className={cls("hstab", h)}>
        <polygon points="792,236 868,150 892,156 880,236" fill={fill("hstab", h, WING)} stroke={BODY_STROKE} />
        <polygon points="792,244 880,244 892,324 868,330" fill={fill("hstab", h, WING)} stroke={BODY_STROKE} />
      </g>
      <g className={cls("elevator", h)}>
        <polygon points="880,176 892,156 888,210 878,210" fill={fill("elevator", h, SURF)} stroke={SURF_STROKE} />
        <polygon points="878,270 888,270 892,324 880,304" fill={fill("elevator", h, SURF)} stroke={SURF_STROKE} />
      </g>

      {/* APU (tailcone) */}
      <g className={cls("apu", h)}>
        <circle cx="846" cy="240" r="9" fill={fill("apu", h, "#1a2740")} stroke="#7c8aa3" />
      </g>
      </g>
    </g>
  );
}

/* --------------------------------------------------------------- SIDE VIEW */
export function FalconSideView({ highlight }: { highlight?: string }) {
  const h = highlight;
  return (
    <g>
      <AcDefs />
      <g filter="url(#acShadow)">
      {/* Fuselage profile */}
      <path
        d="M40,196 C90,176 150,168 230,166 L760,170 C812,172 856,182 884,196 C860,206 812,214 760,216 L230,220 C150,220 90,214 40,196 Z"
        fill={fill("fuselage", h, BODY)}
        stroke={BODY_STROKE}
        strokeWidth="2"
        className={cls("fuselage", h)}
      />
      {/* Windshield + cabin windows */}
      <path d="M120,184 C150,176 180,174 206,176 L206,196 L120,196 Z" fill="#0e1828" stroke={BODY_STROKE} />
      {[260, 300, 340, 380, 420, 460, 500, 540, 580].map((x) => (
        <circle key={x} cx={x} cy="188" r="4" fill="#2b3c57" />
      ))}

      {/* Wing (side, low-mounted) */}
      <g className={cls("wing", h)}>
        <polygon points="360,206 560,206 540,224 380,224" fill={fill("wing", h, WING)} stroke={BODY_STROKE} />
      </g>
      {/* Flaps / slats hint on wing */}
      <g className={cls("slats", h)}>
        <polygon points="360,206 380,206 378,216 360,216" fill={fill("slats", h, SURF)} stroke={SURF_STROKE} />
      </g>

      {/* Vertical fin + rudder */}
      <g className={cls("vfin", h)}>
        <polygon points="690,170 770,70 806,72 800,170" fill={fill("vfin", h, WING)} stroke={BODY_STROKE} />
      </g>
      <g className={cls("rudder", h)}>
        <polygon points="800,80 818,74 824,168 800,168" fill={fill("rudder", h, SURF)} stroke={SURF_STROKE} />
      </g>
      {/* S-duct intake (center engine 3) at fin base */}
      <g className={cls("eng3", h)}>
        <path d="M724,150 C740,120 760,116 776,128 L772,150 Z" fill={fill("eng3", h, ENGINE)} stroke="#7c8aa3" />
      </g>

      {/* Horizontal stabilizer + elevator */}
      <g className={cls("hstab", h)}>
        <polygon points="800,150 884,140 892,150 800,160" fill={fill("hstab", h, WING)} stroke={BODY_STROKE} />
      </g>
      <g className={cls("elevator", h)}>
        <polygon points="868,142 892,150 868,158 864,150" fill={fill("elevator", h, SURF)} stroke={SURF_STROKE} />
      </g>

      {/* Side engines (1/2 overlapped in profile) */}
      <g className={cls("eng1", h)}>
        <rect x="690" y="176" width="120" height="40" rx="20" fill={fill("eng1", h, ENGINE)} stroke="#7c8aa3" strokeWidth="1.5" />
        <circle cx="810" cy="196" r="9" fill="#243044" />
      </g>

      {/* Landing gear (down) */}
      <g className={cls("gearNose", h)}>
        <line x1="190" y1="220" x2="190" y2="266" stroke="#9fb2cf" strokeWidth="4" />
        <circle cx="190" cy="276" r="12" fill={fill("gearNose", h, "#0d1526")} stroke="#9fb2cf" strokeWidth="3" />
      </g>
      <g className={cls("gearMain", h)}>
        <line x1="470" y1="222" x2="470" y2="270" stroke="#9fb2cf" strokeWidth="5" />
        <circle cx="470" cy="282" r="14" fill={fill("gearMain", h, "#0d1526")} stroke="#9fb2cf" strokeWidth="3" />
        <circle cx="498" cy="282" r="14" fill={fill("gearMain", h, "#0d1526")} stroke="#9fb2cf" strokeWidth="3" />
      </g>

      {/* APU exhaust (tailcone) */}
      <g className={cls("apu", h)}>
        <circle cx="876" cy="200" r="8" fill={fill("apu", h, "#1a2740")} stroke="#7c8aa3" />
      </g>

      {/* Windshield anti-ice zone marker handled via hotspot */}
      <g className={cls("windshield", h)}>
        <path d="M120,184 C150,176 180,174 206,176" fill="none" stroke={highlight === "windshield" ? ACCENT : "transparent"} strokeWidth="4" />
      </g>
      </g>
    </g>
  );
}
