import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/cn";
import { shuffle } from "@/lib/shuffle";
import { QUESTIONS } from "@/data/questions";

interface Flashcard {
  front: string;
  back: string;
  cat: string;
}

export function StudyScreen() {
  const cards = useMemo<Flashcard[]>(
    () =>
      shuffle(
        QUESTIONS.map((q) => ({
          front: q.q,
          back: q.choices[q.a],
          cat: q.cat,
        })),
      ),
    [],
  );

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[idx];

  const go = (delta: number) => {
    setFlipped(false);
    setIdx((i) => Math.min(cards.length - 1, Math.max(0, i + delta)));
  };

  return (
    <div>
      <Header subtitle={`Study Mode — Card ${idx + 1}/${cards.length}`} showBack />
      <div className="mx-auto max-w-3xl px-5 py-6">
        <ProgressBar
          value={idx + 1}
          max={cards.length}
          className="mb-5"
          barClassName="bg-purple-500"
        />
        <div
          className={cn("flip-card", flipped && "flipped")}
          style={{ minHeight: 260 }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div className="flip-card-inner" style={{ minHeight: 260 }}>
            <div
              className="flip-face flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-purple-500/60 bg-ink-900/70 p-7 text-center shadow-lg"
              style={{ minHeight: 260 }}
            >
              <div className="mb-3 text-xs uppercase tracking-widest text-purple-400">
                {card.cat} · Question
              </div>
              <div className="text-lg font-medium leading-snug">
                {card.front}
              </div>
              <div className="mt-6 text-xs text-ink-500">Tap to flip</div>
            </div>
            <div
              className="flip-face flip-back flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-emerald-500/60 bg-emerald-900/30 p-7 text-center shadow-lg"
              style={{ minHeight: 260 }}
            >
              <div className="mb-3 text-xs uppercase tracking-widest text-emerald-400">
                Answer
              </div>
              <div className="text-xl font-semibold leading-snug">
                {card.back}
              </div>
              <div className="mt-6 text-xs text-ink-500">Tap to flip back</div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            disabled={idx === 0}
            onClick={() => go(-1)}
          >
            ← Previous
          </Button>
          <Button
            fullWidth
            disabled={idx === cards.length - 1}
            onClick={() => go(1)}
            className="bg-purple-600 hover:bg-purple-500"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
