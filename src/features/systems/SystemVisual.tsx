import { useState } from "react";
import { cn } from "@/lib/cn";
import { InteractiveDiagram } from "./schematics/InteractiveDiagram";
import { AnnotatedDiagram } from "./aircraft/AnnotatedDiagram";
import { getAnnotatedView } from "./aircraft/pointLearn";

type Tab = "aircraft" | "schematic";

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
  const annotated = getAnnotatedView(lessonId);
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
