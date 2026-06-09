import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LearnState {
  /** lessonId -> set of completed step ids */
  completed: Record<string, string[]>;
  markStep: (lessonId: string, stepId: string) => void;
  isStepDone: (lessonId: string, stepId: string) => boolean;
  doneCount: (lessonId: string) => number;
  resetLesson: (lessonId: string) => void;
}

export const useLearn = create<LearnState>()(
  persist(
    (set, get) => ({
      completed: {},
      markStep: (lessonId, stepId) =>
        set((state) => {
          const current = state.completed[lessonId] ?? [];
          if (current.includes(stepId)) return state;
          return {
            completed: {
              ...state.completed,
              [lessonId]: [...current, stepId],
            },
          };
        }),
      isStepDone: (lessonId, stepId) =>
        (get().completed[lessonId] ?? []).includes(stepId),
      doneCount: (lessonId) => (get().completed[lessonId] ?? []).length,
      resetLesson: (lessonId) =>
        set((state) => {
          const next = { ...state.completed };
          delete next[lessonId];
          return { completed: next };
        }),
    }),
    { name: "falcon-learn-v1" },
  ),
);

/** A lesson counts as complete once every one of its steps is done. */
export function lessonComplete(
  completed: Record<string, string[]>,
  lessonId: string,
  totalSteps: number,
): boolean {
  return (completed[lessonId]?.length ?? 0) >= totalSteps && totalSteps > 0;
}
