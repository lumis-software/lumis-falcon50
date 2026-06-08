import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question } from "@/types/content";

interface QuizStats {
  taken: number;
  correct: number;
}

interface ProgressState {
  stats: QuizStats;
  /** Questions answered incorrectly, deduped by prompt text. */
  missed: Question[];
  recordAnswer: (question: Question, correct: boolean) => void;
  clearMissed: () => void;
  reset: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      stats: { taken: 0, correct: 0 },
      missed: [],
      recordAnswer: (question, correct) =>
        set((state) => {
          const missed = correct
            ? state.missed.filter((m) => m.q !== question.q)
            : state.missed.some((m) => m.q === question.q)
              ? state.missed
              : [...state.missed, question];
          return {
            stats: {
              taken: state.stats.taken + 1,
              correct: state.stats.correct + (correct ? 1 : 0),
            },
            missed,
          };
        }),
      clearMissed: () => set({ missed: [] }),
      reset: () => set({ stats: { taken: 0, correct: 0 }, missed: [] }),
    }),
    { name: "lumis_progress_v1" },
  ),
);

export const accuracyPct = (stats: QuizStats): number =>
  stats.taken > 0 ? Math.round((stats.correct / stats.taken) * 100) : 0;
