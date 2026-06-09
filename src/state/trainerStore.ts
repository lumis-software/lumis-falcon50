import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TrainerState {
  /** Procedure id -> number of times completed. */
  completed: Record<string, number>;
  markComplete: (id: string) => void;
  reset: () => void;
}

export const useTrainer = create<TrainerState>()(
  persist(
    (set) => ({
      completed: {},
      markComplete: (id) =>
        set((state) => ({
          completed: {
            ...state.completed,
            [id]: (state.completed[id] ?? 0) + 1,
          },
        })),
      reset: () => set({ completed: {} }),
    }),
    { name: "lumis_trainer_v1" },
  ),
);
