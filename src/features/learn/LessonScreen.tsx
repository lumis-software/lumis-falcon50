import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { QuizScreen } from "@/features/quiz/QuizScreen";
import { SystemVisual } from "@/features/systems/SystemVisual";
import { getLesson, LESSONS } from "./lessonConfig";
import { lessonComplete, useLearn } from "@/state/learnStore";

/** Lightweight text-to-speech for the overview "listen" affordance. */
function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function speak(text: string) {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.97;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }
  function stop() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }
  return { supported, speaking, speak, stop };
}

export function LessonScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const lesson = getLesson(id);

  const [stepIdx, setStepIdx] = useState(0);
  const completed = useLearn((s) => s.completed);
  const markStep = useLearn((s) => s.markStep);
  const speech = useSpeech();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    speech.stop();
    topRef.current?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx, id]);

  if (!lesson) {
    return (
      <div>
        <Header subtitle="Lesson" showBack />
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <p className="text-ink-300">That lesson doesn’t exist.</p>
          <Button className="mt-4" onClick={() => navigate("/learn")}>
            Back to lessons
          </Button>
        </div>
      </div>
    );
  }

  const steps = lesson.steps;
  const step = steps[stepIdx];
  const doneSteps = completed[lesson.id] ?? [];
  const isLast = stepIdx === steps.length - 1;
  const allDone = lessonComplete(completed, lesson.id, steps.length);
  const lessonIndex = LESSONS.findIndex((l) => l.id === lesson.id);
  const nextLesson = LESSONS[lessonIndex + 1];

  function complete(stepId: string) {
    markStep(lesson!.id, stepId);
  }

  function goNext() {
    complete(step.id);
    if (!isLast) setStepIdx((i) => i + 1);
  }

  return (
    <div ref={topRef}>
      <Header subtitle={lesson.name} showBack onBack={() => navigate("/learn")} />
      <div className="mx-auto max-w-3xl px-5 py-5 [animation:var(--animate-fade-in)]">
        {/* Stepper */}
        <div className="mb-5 flex items-center gap-1.5">
          {steps.map((s, i) => {
            const stepDone = doneSteps.includes(s.id);
            const active = i === stepIdx;
            return (
              <button
                key={s.id}
                onClick={() => setStepIdx(i)}
                className="group flex flex-1 flex-col items-center gap-1.5"
                aria-current={active}
              >
                <div className="flex w-full items-center">
                  <div
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors",
                      active
                        ? "border-brand-400 bg-brand-600 text-white"
                        : stepDone
                          ? "border-emerald-500 bg-emerald-600/20 text-emerald-300"
                          : "border-ink-700 bg-ink-900 text-ink-400",
                    )}
                  >
                    {stepDone && !active ? <Check size={14} /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        doneSteps.includes(steps[i].id)
                          ? "bg-emerald-600/50"
                          : "bg-ink-700",
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-center text-[10px] leading-tight",
                    active ? "text-ink-100" : "text-ink-500",
                  )}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-1 text-[11px] uppercase tracking-widest text-brand-400">
          Step {stepIdx + 1} of {steps.length} · {step.modeLabel}
        </div>
        <h2 className="mb-4 text-xl font-bold">{step.title}</h2>

        {/* Step body */}
        {step.kind === "read" && (
          <div className="[animation:var(--animate-fade-in)]">
            <div className="mb-4 flex items-start gap-3">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-800/80 text-3xl">
                {lesson.icon}
              </div>
              <p className="text-sm leading-relaxed text-ink-200">
                {lesson.desc}
              </p>
            </div>

            {speech.supported && (
              <Button
                variant="secondary"
                size="sm"
                className="mb-4"
                onClick={() =>
                  speech.speaking
                    ? speech.stop()
                    : speech.speak(
                        `${lesson.name}. ${lesson.desc}. Key facts. ${lesson.keys.join(". ")}`,
                      )
                }
              >
                {speech.speaking ? (
                  <>
                    <VolumeX size={16} /> Stop
                  </>
                ) : (
                  <>
                    <Volume2 size={16} /> Listen to overview
                  </>
                )}
              </Button>
            )}

            <div className="rounded-card border border-ink-700 bg-ink-900/60 p-4">
              <div className="mb-2 text-xs uppercase tracking-widest text-emerald-400">
                Key facts
              </div>
              <ul className="space-y-2">
                {lesson.keys.map((k, j) => (
                  <li key={j} className="flex gap-2 text-sm text-ink-200">
                    <span className="text-emerald-400">•</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {step.kind === "diagram" && lesson.sysKey && (
          <div className="[animation:var(--animate-fade-in)]">
            <div className="mb-3 rounded-card border border-sky-800/50 bg-sky-950/30 p-3 text-sm text-sky-200">
              On the <span className="font-semibold">Aircraft</span> view, tap a
              numbered marker to point at a part and learn what it is. Switch to
              the <span className="font-semibold">Schematic</span> for the audio
              walk-through and failure scenarios — tap any component for detail.
            </div>
            <div className="rounded-card border border-ink-800 bg-ink-950/40 p-1">
              <SystemVisual sysKey={lesson.sysKey} lessonId={lesson.id} />
            </div>
          </div>
        )}

        {step.kind === "test" && (
          <div className="[animation:var(--animate-fade-in)]">
            <QuizScreen
              embedded
              fixedDeck={lesson.quizDeck}
              onComplete={() => complete("test")}
            />
          </div>
        )}

        {/* Completion banner */}
        {allDone && isLast && (
          <div className="mt-6 rounded-card border border-emerald-700/50 bg-emerald-950/30 p-5 text-center [animation:var(--animate-rise)]">
            <div className="mb-1 text-4xl">🎓</div>
            <div className="text-lg font-bold text-emerald-200">
              {lesson.name} complete
            </div>
            <p className="mt-1 text-sm text-ink-300">
              You’ve studied this system from every angle.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {nextLesson && (
                <Button onClick={() => navigate(`/learn/${nextLesson.id}`)}>
                  Next: {nextLesson.name} <ArrowRight size={16} />
                </Button>
              )}
              <Button variant="secondary" onClick={() => navigate("/learn")}>
                All lessons
              </Button>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() =>
              stepIdx === 0 ? navigate("/learn") : setStepIdx((i) => i - 1)
            }
          >
            <ChevronLeft size={16} />
            {stepIdx === 0 ? "Lessons" : "Back"}
          </Button>

          {!isLast ? (
            <Button onClick={goNext}>
              Next: {steps[stepIdx + 1].title}
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              variant={allDone ? "secondary" : "primary"}
              onClick={() => {
                complete(step.id);
                if (nextLesson) navigate(`/learn/${nextLesson.id}`);
                else navigate("/learn");
              }}
            >
              {nextLesson ? "Finish & continue" : "Finish"}
              <Check size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
