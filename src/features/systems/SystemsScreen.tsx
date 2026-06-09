import { useState } from "react";
import { X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SYSTEMS } from "@/data/content";
import { SystemVisual } from "./SystemVisual";
import { getAnnotatedView } from "./aircraft/pointLearn";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function SystemsScreen() {
  const [active, setActive] = useState<number | null>(null);
  const sys = active !== null ? SYSTEMS[active] : null;
  const sysSlug = sys ? slugify(sys.name) : "";

  return (
    <div>
      <Header subtitle="Aircraft Systems" showBack />
      <div className="mx-auto max-w-3xl px-5 py-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SYSTEMS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="rounded-xl border border-emerald-700/40 bg-ink-900/60 p-4 text-center transition-all hover:border-emerald-500 hover:bg-ink-900/90"
            >
              <div className="mb-1 text-3xl">{s.icon}</div>
              <div className="text-xs font-semibold text-emerald-200">
                {s.name}
              </div>
              {(s.sysKey || getAnnotatedView(slugify(s.name))) && (
                <div className="mt-1 text-[9px] text-emerald-500">
                  {getAnnotatedView(slugify(s.name))
                    ? "🛩️ point & learn"
                    : "🎛️ interactive"}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {sys && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setActive(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-emerald-700/50 bg-ink-900 scrollbar-thin [animation:var(--animate-rise)]"
          >
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-ink-800 bg-ink-900 p-5">
              <div className="text-3xl">{sys.icon}</div>
              <h3 className="flex-1 text-lg font-bold text-emerald-200">
                {sys.name}
              </h3>
              <button
                onClick={() => setActive(null)}
                className="text-ink-400 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 text-sm leading-relaxed text-ink-300">
              {sys.desc}
            </div>
            <div className="px-5 pb-6">
              <div className="mb-2 text-xs uppercase tracking-widest text-emerald-400">
                Key facts
              </div>
              <ul className="space-y-1.5">
                {sys.keys.map((k, j) => (
                  <li key={j} className="flex gap-2 text-sm text-ink-200">
                    <span className="text-emerald-400">•</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
            {(sys.sysKey || getAnnotatedView(sysSlug)) && (
              <div className="px-4 pb-5">
                <div className="mb-2 px-1 text-xs uppercase tracking-widest text-emerald-400">
                  Interactive Diagram
                </div>
                <SystemVisual sysKey={sys.sysKey} lessonId={sysSlug} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
