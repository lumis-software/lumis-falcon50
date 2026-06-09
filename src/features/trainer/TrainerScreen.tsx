import { useMemo, useState } from "react";
import { Check, CircleCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { COCKPIT, TRAINER_PROCEDURES } from "@/data/content";
import { useTrainer } from "@/state/trainerStore";
import type { TrainerProcedure } from "@/types/content";

export function TrainerScreen() {
  const [active, setActive] = useState<TrainerProcedure | null>(null);
  if (active) {
    return <Runner procedure={active} onExit={() => setActive(null)} />;
  }
  return <Picker onPick={setActive} />;
}

function Picker({ onPick }: { onPick: (p: TrainerProcedure) => void }) {
  const completed = useTrainer((s) => s.completed);
  const categories = useMemo(
    () => [...new Set(TRAINER_PROCEDURES.map((p) => p.category))],
    [],
  );

  return (
    <div>
      <Header subtitle="Procedure Trainer" showBack />
      <div className="mx-auto max-w-3xl px-5 py-5">
        <p className="mb-4 text-sm text-ink-400">
          Step through each procedure action-by-action. Confirm each control as
          you set it — your completions are saved.
        </p>
        {categories.map((cat) => (
          <div key={cat} className="mb-5">
            <div className="mb-2 text-xs uppercase tracking-widest text-ink-400">
              {cat}
            </div>
            <div className="space-y-2">
              {TRAINER_PROCEDURES.filter((p) => p.category === cat).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPick(p)}
                  className="flex w-full items-center gap-3 rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-3 text-left transition-all hover:border-ink-500 hover:bg-ink-900/90"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-ink-500">
                      {p.steps.length} steps · {p.desc}
                    </div>
                  </div>
                  {completed[p.id] ? (
                    <CircleCheck size={18} className="shrink-0 text-emerald-400" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Runner({
  procedure,
  onExit,
}: {
  procedure: TrainerProcedure;
  onExit: () => void;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const markComplete = useTrainer((s) => s.markComplete);
  const total = procedure.steps.length;
  const current = procedure.steps[step];
  const control = COCKPIT[current?.ctrl];

  function confirm() {
    if (step >= total - 1) {
      markComplete(procedure.id);
      setDone(true);
    } else {
      setStep((s) => s + 1);
    }
  }

  if (done) {
    return (
      <div>
        <Header subtitle={procedure.name} showBack onBack={onExit} />
        <div className="mx-auto max-w-3xl px-5 py-12 text-center [animation:var(--animate-rise)]">
          <div className="mb-3 text-6xl">✅</div>
          <h2 className="text-2xl font-bold">Procedure complete</h2>
          <p className="mt-1 text-ink-400">
            {procedure.name} — {total} steps
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="secondary" onClick={onExit}>
              Back to list
            </Button>
            <Button
              onClick={() => {
                setStep(0);
                setDone(false);
              }}
            >
              Run again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header subtitle={procedure.name} showBack onBack={onExit} />
      <div className="mx-auto max-w-3xl px-5 py-6">
        <ProgressBar value={step} max={total} className="mb-5" />

        <div className="mb-4 rounded-2xl border border-emerald-700/50 bg-ink-900/70 p-6 [animation:var(--animate-fade-in)]">
          <div className="mb-1 text-xs uppercase tracking-widest text-emerald-400">
            Step {step + 1} of {total}
            {control ? ` · ${control.group} · ${control.panel}` : ""}
          </div>
          <div className="text-xl font-semibold leading-snug">
            {current.action}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {control && (
              <span className="rounded-lg border border-ink-700 bg-ink-800 px-3 py-1 font-mono text-sm">
                {control.label}
              </span>
            )}
            <span className="text-ink-500">→</span>
            <span className="rounded-lg border border-emerald-600/60 bg-emerald-900/30 px-3 py-1 font-mono text-sm font-bold text-emerald-200">
              {current.target}
            </span>
          </div>
          {current.note && (
            <p className="mt-4 text-sm leading-relaxed text-ink-400">
              {current.note}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            ← Back
          </Button>
          <Button
            fullWidth
            onClick={confirm}
            className="bg-emerald-600 hover:bg-emerald-500"
          >
            <Check size={16} />
            {step >= total - 1 ? "Confirm — finish" : "Confirm & next"}
          </Button>
        </div>

        <ol className="mt-6 space-y-1.5">
          {procedure.steps.map((s, i) => (
            <li
              key={i}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm",
                i === step
                  ? "bg-emerald-900/30 text-emerald-100"
                  : i < step
                    ? "text-ink-500 line-through"
                    : "text-ink-400",
              )}
            >
              <span className="w-5 font-mono text-xs">{i + 1}</span>
              {s.action}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
