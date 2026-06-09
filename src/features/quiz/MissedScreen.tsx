import { useProgress } from "@/state/progressStore";
import { QuizScreen } from "./QuizScreen";

export function MissedScreen() {
  const missed = useProgress((s) => s.missed);
  return (
    <QuizScreen
      fixedDeck={missed}
      title="Review Missed"
      emptyMessage="No missed questions — great work. Take a quiz to populate this list."
    />
  );
}
