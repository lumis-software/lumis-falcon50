import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { cn } from "@/lib/cn";
import { PROCEDURES } from "@/data/content";

export function ProceduresScreen() {
  const types = useMemo(
    () => [...new Set(PROCEDURES.map((p) => p.type))],
    [],
  );
  const [filter, setFilter] = useState(
    types.includes("Emergency") ? "Emergency" : types[0],
  );
  const [active, setActive] = useState<string | null>(null);

  const list = PROCEDURES.filter((p) => p.type === filter);
  const emergency = filter.toLowerCase().includes("emerg");

  return (
    <div>
      <Header subtitle="Procedures" showBack />
      <div className="mx-auto max-w-3xl px-5 py-5">
        <SegmentedControl
          segments={types.map((t) => ({ value: t, label: t }))}
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setActive(null);
          }}
          className="mb-4"
        />
        <div className="space-y-2">
          {list.map((p) => {
            const open = active === p.id;
            return (
              <div
                key={p.id}
                className={cn(
                  "overflow-hidden rounded-xl border bg-ink-900/60",
                  emergency ? "border-red-700/40" : "border-sky-700/40",
                )}
              >
                <button
                  onClick={() => setActive(open ? null : p.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-ink-900/90"
                  aria-expanded={open}
                >
                  <div>
                    <div
                      className={cn(
                        "font-semibold",
                        emergency ? "text-red-300" : "text-sky-300",
                      )}
                    >
                      {p.title}
                    </div>
                    <div className="font-mono text-xs text-ink-500">{p.id}</div>
                  </div>
                  <span className="text-sm text-ink-500">{open ? "▼" : "▶"}</span>
                </button>
                {open && (
                  <ol className="space-y-2 px-4 pb-4 pt-1 text-sm [animation:var(--animate-fade-in)]">
                    {p.steps.map((s, j) => (
                      <li key={j} className="flex gap-3">
                        <span
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold",
                            emergency
                              ? "border-red-700/50 bg-red-900/50 text-red-300"
                              : "border-sky-700/50 bg-sky-900/50 text-sky-300",
                          )}
                        >
                          {j + 1}
                        </span>
                        <span className="flex-1 text-ink-200">{s}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
