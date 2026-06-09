import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { shuffle } from "@/lib/shuffle";
import { QUESTION_CATEGORIES, QUESTIONS } from "@/data/questions";
import type { Question } from "@/types/content";
import { useProgress } from "@/state/progressStore";

type Phase = "setup" | "running" | "done";

interface QuizScreenProps {
  /** When provided, skips category setup and quizzes this fixed deck. */
  fixedDeck?: Question[];
  title?: string;
  emptyMessage?: string;
}

export function QuizScreen({
  fixedDeck,
  title = "Quiz Mode",
  emptyMessage,
}: QuizScreenProps = {}) {
  const isFixed = fixedDeck !== undefined;
  const [phase, setPhase] = useState<Phase>(isFixed ? "running" : "setup");
  const [category, setCategory] = useState<string | null>(null);
  const [deck, setDeck] = useState<Question[]>(() =>
    isFixed ? shuffle(fixedDeck) : [],
  );
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const recordAnswer = useProgress((s) => s.recordAnswer);

  const pool = useMemo(
    () => (category ? QUESTIONS.filter((q) => q.cat === category) : QUESTIONS),
    [category],
  );

  if (isFixed && fixedDeck.length === 0) {
    return (
      <div>
        <Header subtitle={title} showBack />
        <div className="mx-auto max-w-3xl px-5 py-16 text-center [animation:var(--animate-fade-in)]">
          <div className="mb-3 text-5xl">🎉</div>
          <p className="text-lg">
            {emptyMessage ?? "Nothing to review — you're all caught up."}
          </p>
        </div>
      </div>
    );
  }

  function start() {
    setDeck(shuffle(isFixed ? fixedDeck : pool));
    setIdx(0);
    setSelected(null);
    setScore(0);
    setPhase("running");
  }

  function choose(i: number) {
    if (selected !== null) return;
    const q = deck[idx];
    const correct = i === q.a;
    setSelected(i);
    if (correct) setScore((s) => s + 1);
    recordAnswer(q, correct);
  }

  function next() {
    if (idx >= deck.length - 1) {
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
    }
  }

  if (phase === "setup") {
    return (
      <div>
        <Header subtitle={title} showBack />
        <div className="mx-auto max-w-3xl px-5 py-6 [animation:var(--animate-fade-in)]">
          <h2 className="text-lg font-semibold">Choose a category</h2>
          <p className="mb-4 text-sm text-ink-400">
            {QUESTIONS.length} questions available. Pick a focus area or quiz
            everything.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <CategoryChip
              label="All categories"
              count={QUESTIONS.length}
              active={category === null}
              onClick={() => setCategory(null)}
            />
            {QUESTION_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                count={QUESTIONS.filter((q) => q.cat === cat).length}
                active={category === cat}
                onClick={() => setCategory(cat)}
              />
            ))}
          </div>
          <Button size="lg" fullWidth className="mt-6" onClick={start}>
            Start {pool.length} questions →
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const pct = deck.length ? Math.round((score / deck.length) * 100) : 0;
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "📖";
    const color =
      pct >= 80 ? "#34d399" : pct >= 60 ? "#fbbf24" : "#f87171";
    return (
      <div>
        <Header subtitle="Quiz Complete" showBack />
        <div className="mx-auto max-w-3xl px-5 py-10 text-center [animation:var(--animate-rise)]">
          <div className="mb-2 text-6xl">{emoji}</div>
          <h2 className="text-2xl font-bold">
            {score} / {deck.length}
          </h2>
          <p className="mt-1 text-3xl font-bold" style={{ color }}>
            {pct}%
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {!isFixed && (
              <Button variant="secondary" onClick={() => setPhase("setup")}>
                Change category
              </Button>
            )}
            <Button onClick={start}>Try again</Button>
          </div>
        </div>
      </div>
    );
  }

  const q = deck[idx];
  return (
    <div>
      <Header subtitle={`Quiz — Q${idx + 1}/${deck.length}`} showBack />
      <div className="mx-auto max-w-3xl px-5 py-6">
        <ProgressBar value={idx} max={deck.length} className="mb-5" />
        <div className="mb-2 text-xs uppercase tracking-widest text-brand-400">
          {q.cat}
        </div>
        <h2 className="mb-5 text-lg font-semibold leading-snug">{q.q}</h2>
        <div className="space-y-2">
          {q.choices.map((choice, i) => {
            const isCorrect = i === q.a;
            const isSelected = selected === i;
            let style =
              "border-ink-700 bg-ink-900/60 hover:border-ink-500";
            if (selected !== null) {
              if (isCorrect)
                style = "border-emerald-500 bg-emerald-900/30";
              else if (isSelected) style = "border-red-500 bg-red-900/30";
              else style = "border-ink-800 bg-ink-900/40 opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={selected !== null}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                  style,
                )}
              >
                <span className="w-5 font-mono text-ink-400">
                  {String.fromCharCode(65 + i)}.
                </span>
                <span className="flex-1">{choice}</span>
                {selected !== null && isCorrect && (
                  <Check size={18} className="text-emerald-400" />
                )}
                {selected !== null && isSelected && !isCorrect && (
                  <X size={18} className="text-red-400" />
                )}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <Button size="lg" fullWidth className="mt-5" onClick={next}>
            {idx === deck.length - 1 ? "See results →" : "Next question →"}
          </Button>
        )}
        <div className="mt-4 text-center text-xs text-ink-500">
          Score: {score} / {idx + (selected !== null ? 1 : 0)}
        </div>
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3 py-2.5 text-left transition-all",
        active
          ? "border-brand-400 bg-brand-600/15"
          : "border-ink-700 bg-ink-900/50 hover:border-ink-500",
      )}
      aria-pressed={active}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className="text-[11px] text-ink-500">{count} questions</div>
    </button>
  );
}
