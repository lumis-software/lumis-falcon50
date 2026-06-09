import { useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle2, Headphones, Workflow } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { LESSONS } from "./lessonConfig";
import { lessonComplete, useLearn } from "@/state/learnStore";

const KIND_ICON = {
  read: BookOpen,
  diagram: Workflow,
  test: Headphones,
} as const;

export function LearnScreen() {
  const navigate = useNavigate();
  const completed = useLearn((s) => s.completed);

  const doneLessons = LESSONS.filter((l) =>
    lessonComplete(completed, l.id, l.steps.length),
  ).length;
  const overallPct = Math.round((doneLessons / LESSONS.length) * 100);

  return (
    <div>
      <Header subtitle="Guided Lessons" showBack />
      <div className="mx-auto max-w-3xl px-5 py-6 [animation:var(--animate-fade-in)]">
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Learn the aircraft systems</h2>
          <p className="mt-1 text-sm text-ink-400">
            Each lesson teaches a system three ways — read it, hear it, and see
            it move on a live schematic — then checks your knowledge. Work
            through them in order, or jump to any system.
          </p>
        </div>

        <div className="mb-6 rounded-card border border-ink-700 bg-ink-900/60 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Course progress</span>
            <span className="text-ink-400">
              {doneLessons} / {LESSONS.length} systems · {overallPct}%
            </span>
          </div>
          <ProgressBar
            value={doneLessons}
            max={LESSONS.length}
            barClassName="bg-emerald-500"
          />
        </div>

        <div className="space-y-3">
          {LESSONS.map((lesson, i) => {
            const done = completed[lesson.id]?.length ?? 0;
            const total = lesson.steps.length;
            const complete = lessonComplete(completed, lesson.id, total);
            return (
              <Card
                key={lesson.id}
                accent={complete ? "emerald" : "slate"}
                interactive
                onClick={() => navigate(`/learn/${lesson.id}`)}
                className="px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink-800/80 text-2xl">
                    {lesson.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-ink-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate font-semibold">
                        {lesson.name}
                      </span>
                      {complete && (
                        <CheckCircle2
                          size={16}
                          className="shrink-0 text-emerald-400"
                        />
                      )}
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-ink-400">
                      {lesson.desc}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {lesson.steps.map((step) => {
                          const Icon = KIND_ICON[step.kind];
                          const stepDone = (
                            completed[lesson.id] ?? []
                          ).includes(step.id);
                          return (
                            <span
                              key={step.id}
                              title={step.title}
                              className={cn(
                                "grid size-6 place-items-center rounded-md border",
                                stepDone
                                  ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                                  : "border-ink-700 bg-ink-800/60 text-ink-400",
                              )}
                            >
                              <Icon size={13} />
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-[11px] text-ink-500">
                        {done}/{total} steps
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-[10px] leading-relaxed text-ink-600">
          Training aid only. Always refer to the AFM and current company manuals
          for operational use.
        </p>
      </div>
    </div>
  );
}
