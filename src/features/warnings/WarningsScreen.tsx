import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Bell } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/cn";
import { ANNUNCIATORS, type Annunciator, type Severity } from "@/data/annunciators";

type Filter = "all" | Severity;

const SEV_TILE: Record<Severity, string> = {
  warning: "bg-red-600 text-white border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.5)]",
  caution: "bg-amber-500 text-ink-950 border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.45)]",
  advisory: "bg-sky-600 text-white border-sky-300 shadow-[0_0_10px_rgba(14,165,233,0.45)]",
};

const SEV_LABEL: Record<Severity, string> = {
  warning: "WARNING",
  caution: "CAUTION",
  advisory: "ADVISORY",
};

const SEV_TEXT: Record<Severity, string> = {
  warning: "text-red-400",
  caution: "text-amber-400",
  advisory: "text-sky-400",
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "warning", label: "Warnings" },
  { id: "caution", label: "Cautions" },
  { id: "advisory", label: "Advisory" },
];

export function WarningsScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initial =
    ANNUNCIATORS.find((a) => a.id === params.get("id"))?.id ??
    ANNUNCIATORS[0].id;
  const [filter, setFilter] = useState<Filter>("all");
  const [selId, setSelId] = useState<string>(initial);

  const tiles = useMemo(
    () =>
      filter === "all"
        ? ANNUNCIATORS
        : ANNUNCIATORS.filter((a) => a.severity === filter),
    [filter],
  );

  const sel: Annunciator =
    ANNUNCIATORS.find((a) => a.id === selId) ?? ANNUNCIATORS[0];

  return (
    <div>
      <Header subtitle="Caution & Warning — what it means, where to look" showBack />
      <div className="mx-auto max-w-3xl px-4 py-5">
        {/* Master explainer */}
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-red-700/50 bg-red-950/30 p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-red-300">
              <span className="grid size-5 place-items-center rounded bg-red-600 text-[10px] text-white">
                !
              </span>
              MASTER WARNING (red)
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-300">
              Flashing red on the glareshield + horn. Demands immediate action —
              usually a bold-face / memory item. Press to acknowledge, then act
              and confirm on the offending system.
            </p>
          </div>
          <div className="rounded-xl border border-amber-700/50 bg-amber-950/30 p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <span className="grid size-5 place-items-center rounded bg-amber-500 text-[10px] text-ink-950">
                !
              </span>
              MASTER CAUTION (amber)
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-300">
              Amber on the glareshield. Acknowledge, then scan the annunciator
              panel to find the lit caution and run the appropriate checklist.
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-3 flex gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.id
                  ? "bg-ink-100 text-ink-950"
                  : "border border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Simulated annunciator panel */}
        <div className="mb-4 rounded-2xl border border-ink-700 bg-black/50 p-3 shadow-inner">
          <div className="mb-2 text-center text-[10px] uppercase tracking-[0.3em] text-ink-500">
            Annunciator panel · tap a light
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {tiles.map((a) => {
              const on = a.id === selId;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelId(a.id)}
                  className={cn(
                    "rounded-md border px-1.5 py-2 text-center text-[11px] font-bold leading-tight tracking-wide transition-all",
                    SEV_TILE[a.severity],
                    on ? "scale-[1.04] ring-2 ring-white/80" : "opacity-70 hover:opacity-100",
                  )}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected association */}
        <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-900/60">
          <div className="flex items-center justify-between border-b border-ink-800 px-4 py-2.5">
            <span className="font-mono text-base font-bold text-ink-50">
              {sel.label}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                sel.severity === "warning"
                  ? "border-red-500 text-red-400"
                  : sel.severity === "caution"
                    ? "border-amber-500 text-amber-400"
                    : "border-sky-500 text-sky-400",
              )}
            >
              {SEV_LABEL[sel.severity]}
            </span>
          </div>
          <div className="space-y-3 px-4 py-3 text-sm">
            <Row label="You see / hear" value={sel.see} />
            <Row label="What it means" value={sel.means} />
            <Row label="What to do" value={sel.action} accent={SEV_TEXT[sel.severity]} />
            <Row label="Where to look" value={sel.panel} />
          </div>
          <div className="flex flex-wrap gap-2 border-t border-ink-800 px-4 py-3">
            <button
              onClick={() => navigate(`/learn/${sel.systemSlug}`)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              Open {sel.systemName} diagram <ArrowRight size={14} />
            </button>
            {sel.memoryRef && (
              <button
                onClick={() => navigate("/memory")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-700 bg-ink-900 px-3 py-1.5 text-xs font-semibold text-red-300 hover:border-red-500"
              >
                <BookOpen size={14} /> Memory item: {sel.memoryRef}
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-ink-500">
          <Bell size={14} className="mt-0.5 shrink-0" />
          <span>
            Study cross-reference, not a reproduction of a specific certified
            panel — exact legends, colours and placement vary with airframe mod
            status. Always fly by your AFM/QRH and the actual aircraft.
          </span>
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-ink-500">
        {label}
      </div>
      <div className={cn("mt-0.5 leading-relaxed text-ink-200", accent)}>
        {value}
      </div>
    </div>
  );
}
