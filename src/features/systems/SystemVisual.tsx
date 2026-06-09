import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { InteractiveDiagram } from "./schematics/InteractiveDiagram";
import { AnnotatedDiagram } from "./aircraft/AnnotatedDiagram";
import { getAnnotatedView } from "./aircraft/pointLearn";
import { annunciatorsForSystem, type Severity } from "@/data/annunciators";

type Tab = "aircraft" | "schematic";

const CHIP: Record<Severity, string> = {
  warning: "border-red-600 bg-red-950/40 text-red-300 hover:border-red-400",
  caution: "border-amber-600 bg-amber-950/40 text-amber-300 hover:border-amber-400",
  advisory: "border-sky-600 bg-sky-950/40 text-sky-300 hover:border-sky-400",
};

/**
 * Unified visual for a system: an "Aircraft" point-and-learn view (when we have
 * annotated artwork for it) and/or the interactive engineering schematic.
 */
export function SystemVisual({
  sysKey,
  lessonId,
}: {
  sysKey?: string;
  lessonId: string;
}) {
  const navigate = useNavigate();
  const annotated = getAnnotatedView(lessonId);
  const related = annunciatorsForSystem(lessonId);
  const [tab, setTab] = useState<Tab>(annotated ? "aircraft" : "schematic");

  if (!annotated && !sysKey) return null;

  return (
    <div>
      {annotated && sysKey && (
        <div className="mb-2 flex gap-2 px-1">
          <TabButton active={tab === "aircraft"} onClick={() => setTab("aircraft")}>
            🛩️ Aircraft
          </TabButton>
          <TabButton
            active={tab === "schematic"}
            onClick={() => setTab("schematic")}
          >
            🎛️ Schematic
          </TabButton>
        </div>
      )}

      {annotated && (!sysKey || tab === "aircraft") && (
        <AnnotatedDiagram data={annotated} />
      )}
      {sysKey && (!annotated || tab === "schematic") && (
        <InteractiveDiagram sysKey={sysKey} />
      )}

      {related.length > 0 && (
        <div className="mt-3 rounded-lg border border-ink-800 bg-ink-900/50 p-3">
          <div className="mb-1.5 text-[10px] uppercase tracking-widest text-ink-500">
            Related cockpit indications
          </div>
          <div className="flex flex-wrap gap-1.5">
            {related.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate(`/warnings?id=${a.id}`)}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px] font-bold tracking-wide transition-colors",
                  CHIP[a.severity],
                )}
                title="Open Caution & Warning reference"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
        active
          ? "bg-emerald-600 text-white"
          : "border border-ink-700 bg-ink-900 text-ink-300",
      )}
    >
      {children}
    </button>
  );
}
