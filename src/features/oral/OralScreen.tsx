import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { AccordionItem } from "@/components/ui/Accordion";
import { ORAL_QUESTIONS } from "@/data/content";
import { useAircraft } from "@/providers/AircraftProvider";
import type { OralQuestion } from "@/types/content";

type Scope = "all" | "shared" | "aircraft";

export function OralScreen() {
  const { aircraft, aircraftKey } = useAircraft();
  const [scope, setScope] = useState<Scope>("all");

  const shared = ORAL_QUESTIONS.shared ?? [];
  const specific = ORAL_QUESTIONS[aircraftKey] ?? [];

  const questions = useMemo<OralQuestion[]>(() => {
    if (scope === "shared") return shared;
    if (scope === "aircraft") return specific;
    return [...shared, ...specific];
  }, [scope, shared, specific]);

  return (
    <div>
      <Header subtitle="Checkride Oral Prep" showBack />
      <div className="mx-auto max-w-3xl px-5 py-5">
        <SegmentedControl
          segments={[
            { value: "all", label: "All" },
            { value: "shared", label: "Shared" },
            { value: "aircraft", label: aircraft.short },
          ]}
          value={scope}
          onChange={setScope}
          className="mb-4"
        />
        <p className="mb-4 text-xs text-ink-500">
          {questions.length} examiner-style questions. Tap to reveal the model
          answer.
        </p>
        <div className="space-y-2">
          {questions.map((item, i) => (
            <AccordionItem
              key={i}
              title={<span className="text-sm">{item.q}</span>}
              meta={
                <span className="text-[10px] uppercase tracking-wide text-brand-400">
                  {item.cat}
                </span>
              }
              accentClass="border-brand-500/30"
            >
              <p className="text-sm leading-relaxed text-ink-200">{item.a}</p>
            </AccordionItem>
          ))}
          {questions.length === 0 && (
            <div className="py-10 text-center text-ink-500">
              No questions for this aircraft yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
