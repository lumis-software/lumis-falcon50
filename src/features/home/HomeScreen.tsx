import { useNavigate } from "react-router-dom";
import { WifiOff } from "lucide-react";
import { AircraftPicker } from "@/components/AircraftPicker";
import { Card } from "@/components/ui/Card";
import { STUDY_MODES } from "./modes";
import { accuracyPct, useProgress } from "@/state/progressStore";
import { useAircraft } from "@/providers/AircraftProvider";
import { useAuth } from "@/providers/AuthProvider";

export function HomeScreen() {
  const navigate = useNavigate();
  const { aircraft } = useAircraft();
  const { backendEnabled, isGuest, profile } = useAuth();
  const stats = useProgress((s) => s.stats);
  const missedCount = useProgress((s) => s.missed.length);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-16 pt-6 [animation:var(--animate-fade-in)]">
      <div className="mb-5 mt-2 text-center">
        <div className="mb-1 text-5xl">✈️</div>
        <h1 className="text-2xl font-bold tracking-tight">
          LUMIS — Falcon Training
        </h1>
        <p className="mt-1 text-xs text-ink-400">
          Falcon 50 · 50EX · 900 family
        </p>
      </div>

      <AircraftPicker />

      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">
          Ready to study the {aircraft.name}?
        </h2>
        <p className="text-sm text-ink-400">
          {isGuest
            ? "Studying offline as guest — your progress saves on this device."
            : `Welcome back, ${profile.name}.`}
        </p>
      </div>

      <div className="space-y-3">
        {STUDY_MODES.map((mode) => {
          const Icon = mode.icon;
          const disabled = !mode.ready;
          const isMissed = mode.id === "missed";
          return (
            <Card
              key={mode.id}
              accent={mode.accent}
              interactive={!disabled}
              onClick={disabled ? undefined : () => navigate(mode.path)}
              className={
                "px-5 py-4" +
                (disabled ? " opacity-55" : "") +
                (isMissed && missedCount === 0 ? " opacity-50" : "")
              }
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-ink-800/80 text-ink-200">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-semibold">
                    {mode.title}
                    {isMissed && (
                      <span className="text-ink-400">({missedCount})</span>
                    )}
                    {disabled && (
                      <span className="rounded bg-ink-800 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-ink-400">
                        Soon
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-400">{mode.description}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 text-center text-xs text-ink-500">
        Progress saves automatically · {stats.taken} questions answered ·{" "}
        {accuracyPct(stats)}% lifetime accuracy
      </div>

      {!backendEnabled && (
        <div className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-ink-500">
          <WifiOff size={12} />
          Offline mode — cloud sync activates once the backend is connected.
        </div>
      )}

      <p className="mx-auto mt-8 max-w-md text-center text-[10px] leading-relaxed text-ink-600">
        Training aid only. Always refer to the AFM and current company manuals
        for operational use.
      </p>
    </div>
  );
}
