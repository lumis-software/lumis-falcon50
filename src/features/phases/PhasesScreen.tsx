import { useEffect, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { FLIGHT_PHASES } from "@/data/content";
import type { PhaseState } from "@/types/content";
import { FalconSideView, FalconTopView } from "./aircraftView";

type TileColor = "go" | "warn" | "caution" | "info" | "slate";

const TILE_CLASS: Record<TileColor, string> = {
  go: "border-emerald-600 bg-emerald-900/40 text-emerald-100",
  warn: "border-red-600 bg-red-900/40 text-red-100",
  caution: "border-amber-600 bg-amber-900/40 text-amber-100",
  info: "border-brand-500 bg-brand-600/25 text-brand-50",
  slate: "border-ink-700 bg-ink-900/60 text-ink-300",
};

/** Static border classes so Tailwind's JIT can see them (no interpolation). */
const PHASE_BORDER: Record<string, string> = {
  slate: "border-ink-600",
  amber: "border-amber-500",
  red: "border-red-500",
  blue: "border-brand-500",
  emerald: "border-emerald-500",
  sky: "border-sky-500",
};

function Tile({
  label,
  value,
  sub,
  color = "slate",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: TileColor;
}) {
  return (
    <div className={cn("rounded-lg border px-2.5 py-1.5", TILE_CLASS[color])}>
      <div className="text-[9px] uppercase tracking-wider opacity-80">
        {label}
      </div>
      <div className="font-mono text-sm font-bold leading-tight">{value}</div>
      {sub && <div className="text-[9px] opacity-80">{sub}</div>}
    </div>
  );
}

function synoptic(s: PhaseState): { key: string; el: ReactNode }[] {
  const tiles: { key: string; el: ReactNode }[] = [];
  const add = (key: string, el: ReactNode) => tiles.push({ key, el });

  s.eng.forEach((e, i) =>
    add(`eng${i}`, (
      <Tile
        label={`ENG ${i + 1}`}
        value={e.run ? `N1 ${e.n1}%` : "OFF"}
        sub={e.run ? `ITT ${e.itt}°C` : undefined}
        color={e.run ? "go" : "slate"}
      />
    )),
  );
  add("apu", (
    <Tile
      label="APU"
      value={s.apu.run ? `${s.apu.n1}%` : "OFF"}
      sub={s.apu.run ? `ITT ${s.apu.itt}°` : undefined}
      color={s.apu.run ? "caution" : "slate"}
    />
  ));
  s.gen.forEach((g, i) =>
    add(`gen${i}`, (
      <Tile label={`GEN ${i + 1}`} value={g ? "ON" : "—"} color={g ? "go" : "slate"} />
    )),
  );
  add("lmain", <Tile label="L Main" value={s.buses.lMain ? "PWR" : "—"} color={s.buses.lMain ? "info" : "slate"} />);
  add("rmain", <Tile label="R Main" value={s.buses.rMain ? "PWR" : "—"} color={s.buses.rMain ? "info" : "slate"} />);
  s.hyd.forEach((h, i) =>
    add(`hyd${i}`, (
      <Tile label={`HYD ${i + 1}`} value={h ? `${h}` : "0"} sub="psi" color={h >= 2800 ? "go" : "slate"} />
    )),
  );
  add("cabinAlt", <Tile label="Cabin Alt" value={`${s.cabinAlt}`} sub="ft" color={s.cabinAlt > 8000 ? "caution" : "info"} />);
  add("dp", <Tile label="ΔP" value={s.cabinDiff.toFixed(1)} sub="psi" color={s.cabinDiff > 9 ? "warn" : "info"} />);
  add("ap", <Tile label="A/P" value={s.autopilot ? "ENG" : "—"} color={s.autopilot ? "go" : "slate"} />);
  add("yd", <Tile label="Yaw Damp" value={s.yawDamp ? "ON" : "—"} color={s.yawDamp ? "go" : "slate"} />);
  add("gear", (
    <Tile
      label="Gear"
      value={s.gear === "up" ? "UP" : s.gear === "transit_up" ? "TRANS" : "DOWN"}
      color={s.gear === "down" ? "go" : s.gear === "transit_up" ? "caution" : "slate"}
    />
  ));
  add("flaps", <Tile label="Flaps" value={`${s.flap}°`} color={s.flap > 0 ? "caution" : "slate"} />);
  add("slats", <Tile label="Slats" value={s.slat ? "EXT" : "IN"} color={s.slat ? "caution" : "slate"} />);
  add("ab", <Tile label="Airbrake" value={s.airbrake ? "EXT" : "IN"} color={s.airbrake ? "caution" : "slate"} />);
  add("engai", <Tile label="Eng A/I" value={s.antiIce.eng ? "ON" : "OFF"} color={s.antiIce.eng ? "info" : "slate"} />);
  add("xpdr", <Tile label="XPDR" value={s.transponder} color={s.transponder === "TA/RA" ? "go" : "slate"} />);
  return tiles;
}

export function PhasesScreen() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<"side" | "top">("side");
  const phase = FLIGHT_PHASES[idx];

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (idx < FLIGHT_PHASES.length - 1) setIdx(idx + 1);
      else setPlaying(false);
    }, 4500);
    return () => clearTimeout(t);
  }, [playing, idx]);

  const go = (i: number) => {
    setPlaying(false);
    setIdx(Math.max(0, Math.min(FLIGHT_PHASES.length - 1, i)));
  };

  return (
    <div>
      <Header subtitle={`Live Flight — ${phase.name}`} showBack />
      <div className="mx-auto max-w-3xl px-3 py-4">
        <div className="-mx-1 overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex min-w-max gap-1 px-1">
            {FLIGHT_PHASES.map((p, i) => (
              <button
                key={p.id}
                onClick={() => go(i)}
                className={cn(
                  "min-w-[68px] shrink-0 rounded-lg border px-2.5 py-2 text-center text-[10px] font-medium transition-all",
                  i === idx
                    ? "border-emerald-400 bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                    : i < idx
                      ? "border-ink-700 bg-ink-800 text-ink-400"
                      : "border-ink-700 bg-ink-900/60 text-ink-300 hover:border-ink-500",
                )}
              >
                <div className="mb-1 text-base leading-none">{p.icon}</div>
                <div className="leading-tight">{p.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3 mt-3 flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled={idx === 0} onClick={() => go(idx - 1)}>
            ← Prev
          </Button>
          <Button
            size="sm"
            onClick={() => setPlaying((p) => !p)}
            className={playing ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "Pause" : "Auto-Play"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={idx === FLIGHT_PHASES.length - 1}
            onClick={() => go(idx + 1)}
          >
            Next →
          </Button>
          <div className="ml-auto text-xs text-ink-400">
            {idx + 1} / {FLIGHT_PHASES.length}
          </div>
        </div>

        <div
          className={cn(
            "mb-3 rounded-xl border-l-4 bg-ink-900/60 px-4 py-3",
            PHASE_BORDER[phase.color] ?? "border-ink-600",
          )}
        >
          <div className="text-xs uppercase tracking-widest text-ink-400">
            {phase.short}
          </div>
          <div className="mt-1 text-sm leading-relaxed text-ink-200">
            {phase.description}
          </div>
        </div>

        <div className="mb-3 overflow-hidden rounded-xl border border-ink-800 bg-ink-950/60">
          <div className="flex items-center justify-between border-b border-ink-800 px-3 py-1.5">
            <span className="text-[11px] uppercase tracking-widest text-emerald-400">
              Aircraft
            </span>
            <div className="flex gap-1">
              {(["side", "top"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors",
                    view === v
                      ? "bg-emerald-600 text-white"
                      : "border border-ink-700 bg-ink-900 text-ink-300",
                  )}
                >
                  {v} view
                </button>
              ))}
            </div>
          </div>
          <div className="p-1">
            {view === "side" ? (
              <FalconSideView s={phase.state} />
            ) : (
              <FalconTopView s={phase.state} />
            )}
          </div>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {synoptic(phase.state).map((t) => (
            <div key={t.key}>{t.el}</div>
          ))}
        </div>

        <div className="rounded-xl border border-emerald-700/40 bg-ink-900/60 px-4 py-3">
          <div className="mb-2 text-xs uppercase tracking-widest text-emerald-400">
            Pilot Actions
          </div>
          <ol className="space-y-1.5">
            {phase.checklist.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="grid size-5 shrink-0 place-items-center rounded-full border border-emerald-700/50 bg-emerald-900/50 text-[10px] font-bold text-emerald-300">
                  {i + 1}
                </span>
                <span className="leading-snug text-ink-200">{c}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-3 text-center text-[10px] text-ink-500">
          Phase sequence is illustrative for systems study. Always follow your
          AFM, company FOM, and current checklist.
        </p>
      </div>
    </div>
  );
}
