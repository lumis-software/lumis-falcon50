import { useAircraft } from "@/providers/AircraftProvider";
import { AIRCRAFT_LIST } from "@/data/aircraft";
import { cn } from "@/lib/cn";

export function AircraftPicker() {
  const { aircraftKey, setAircraft } = useAircraft();

  return (
    <div className="mb-6">
      <div className="mb-2 text-center text-[11px] uppercase tracking-widest text-ink-400">
        Select aircraft
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {AIRCRAFT_LIST.map((ac) => {
          const active = ac.key === aircraftKey;
          return (
            <button
              key={ac.key}
              onClick={() => setAircraft(ac.key)}
              className={cn(
                "flex min-w-[88px] flex-1 flex-col items-center rounded-xl border px-3 py-2.5 transition-all",
                active
                  ? "border-brand-400 bg-brand-600/15 shadow-lg shadow-brand-900/30"
                  : "border-ink-700 bg-ink-900/50 hover:border-ink-500",
              )}
              aria-pressed={active}
            >
              <span className="text-2xl leading-none">{ac.icon}</span>
              <span
                className={cn(
                  "mt-1 text-xs font-semibold",
                  active ? "text-white" : "text-ink-300",
                )}
              >
                {ac.name}
              </span>
              <span
                className={cn(
                  "mt-0.5 text-[9px] uppercase tracking-wide",
                  ac.status === "deep" ? "text-emerald-400" : "text-ink-500",
                )}
              >
                {ac.status === "deep" ? "Full" : "Preview"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
