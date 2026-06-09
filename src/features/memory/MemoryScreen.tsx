import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { MEMORY_ITEMS } from "@/data/content";

export function MemoryScreen() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div>
      <Header subtitle="Memory Items / Immediate Action" showBack />
      <div className="mx-auto max-w-3xl px-5 py-6">
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-900/40 bg-red-900/20 p-3 text-xs text-red-300">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            Immediate-action items are printed in red in the CAE handbook and
            must be performed from memory. Review until automatic.
          </span>
        </div>
        <div className="space-y-2">
          {MEMORY_ITEMS.map((item, i) => {
            const open = active === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-red-700/50 bg-ink-900/60"
              >
                <button
                  onClick={() => setActive(open ? null : i)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-ink-900/90"
                  aria-expanded={open}
                >
                  <span className="font-semibold text-red-300">
                    {item.title}
                  </span>
                  <span className="text-sm text-ink-500">{open ? "▼" : "▶"}</span>
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-1 [animation:var(--animate-fade-in)]">
                    {item.cues && item.cues.length > 0 && (
                      <div className="mb-3 text-xs text-amber-300">
                        <span className="font-semibold uppercase tracking-wider">
                          Cues:{" "}
                        </span>
                        {item.cues.join(" • ")}
                      </div>
                    )}
                    <ol className="space-y-2 text-sm">
                      {item.steps.map((step, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="grid size-6 shrink-0 place-items-center rounded-full border border-red-700/50 bg-red-900/50 text-xs font-bold text-red-300">
                            {j + 1}
                          </span>
                          <span className="flex-1 text-ink-200">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
