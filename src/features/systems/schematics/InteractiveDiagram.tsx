import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { AudioController, INTERACTIVE, SYS_NARRATION } from "./engine";
import { HANDBOOK_IMG } from "./handbook";

type Mode = "interactive" | "handbook";

export function InteractiveDiagram({ sysKey }: { sysKey: string }) {
  const entry = INTERACTIVE[sysKey];

  const defaults = useMemo(() => {
    if (!entry) return {};
    return (entry.def.switches ?? []).reduce<Record<string, string>>(
      (acc, s) => ({ ...acc, [s.id]: s.def }),
      {},
    );
  }, [entry]);

  const [scenario, setScenario] = useState(
    entry ? entry.def.scenarios[0].id : "",
  );
  const [switches, setSwitches] = useState<Record<string, string>>(defaults);
  const [selected, setSelected] = useState<string | null>(null);
  const [audioHl, setAudioHl] = useState<string | string[] | null>(null);
  const [mode, setMode] = useState<Mode>("interactive");

  if (!entry) return null;
  const def = entry.def;

  const narrationKey = sysKey === "env" ? "bleed" : sysKey;
  const narration = SYS_NARRATION[narrationKey] ?? [];
  const state = def.compute({ scenario, switches });
  const activeScen = def.scenarios.find((s) => s.id === scenario);
  const selComp = selected ? def.components[selected] : null;
  const highlight =
    selected ?? (typeof audioHl === "string" ? audioHl : null);

  return (
    <div className="px-5 pb-3">
      {narration.length > 0 && (
        <AudioController
          segments={narration}
          onHighlight={setAudioHl}
          label={`Audio walk-through: ${entry.title}`}
        />
      )}

      {entry.handbook && (
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => setMode("interactive")}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-medium",
              mode === "interactive"
                ? "bg-emerald-600 text-white"
                : "border border-ink-700 bg-ink-900 text-ink-300",
            )}
          >
            🎛️ Interactive
          </button>
          <button
            onClick={() => setMode("handbook")}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-xs font-medium",
              mode === "handbook"
                ? "bg-emerald-600 text-white"
                : "border border-ink-700 bg-ink-900 text-ink-300",
            )}
          >
            📖 CAE Handbook
          </button>
        </div>
      )}

      {mode === "handbook" && entry.handbook ? (
        <div className="overflow-x-auto rounded-lg border border-ink-800 bg-ink-950 p-2">
          <img
            src={HANDBOOK_IMG[entry.handbook]}
            alt={`${entry.title} — CAE handbook schematic`}
            className="h-auto w-full rounded bg-white"
          />
          <div className="mt-2 text-center text-[10px] text-ink-500">
            From Falcon 50 Operating Handbook (CAE), Rev 1 Aug 2025
          </div>
        </div>
      ) : (
        <>
          <div className="mb-1.5 text-[11px] uppercase tracking-widest text-emerald-400">
            Scenario
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {def.scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors",
                  scenario === s.id
                    ? s.id === "normal"
                      ? "bg-emerald-600 text-white"
                      : "bg-red-600 text-white"
                    : "border border-ink-700 bg-ink-900 text-ink-300 hover:border-ink-500",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {activeScen && (
            <div
              className={cn(
                "mb-3 rounded-lg border p-3 text-xs",
                scenario === "normal"
                  ? "border-emerald-800/50 bg-emerald-950/30 text-emerald-200"
                  : "border-red-800/50 bg-red-950/30 text-red-200",
              )}
            >
              <span className="font-semibold">{activeScen.label}:</span>{" "}
              {activeScen.desc}
            </div>
          )}

          {def.switches && def.switches.length > 0 && (
            <>
              <div className="mb-1.5 text-[11px] uppercase tracking-widest text-emerald-400">
                Switches
              </div>
              <div className="mb-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {def.switches.map((sw) => (
                  <div
                    key={sw.id}
                    className="flex items-center gap-2 rounded-md border border-ink-700 bg-ink-900/60 px-2 py-1.5"
                  >
                    <span className="w-20 shrink-0 text-[10px] uppercase text-ink-400">
                      {sw.label}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sw.options.map((o) => (
                        <button
                          key={o.v}
                          onClick={() =>
                            setSwitches((s) => ({ ...s, [sw.id]: o.v }))
                          }
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-medium",
                            switches[sw.id] === o.v
                              ? "bg-amber-600 text-white"
                              : "bg-ink-800 text-ink-400 hover:bg-ink-700",
                          )}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="overflow-x-auto rounded-lg border border-ink-800 bg-ink-950 p-2">
            <def.Render
              state={state}
              onSelect={setSelected}
              selected={highlight}
            />
          </div>

          {selComp && (
            <div className="mt-3 rounded-lg border border-amber-700/50 bg-amber-950/30 p-3 [animation:var(--animate-fade-in)]">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-amber-200">
                    {selComp.name}
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-ink-300">
                    {selComp.info}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-ink-400 hover:text-white"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-3 text-center text-[10px] text-ink-500">
            Tap any component for details. Toggle scenarios to see failure
            effects.
          </div>
        </>
      )}
    </div>
  );
}
