import type { Question } from "@/types/content";
import questions from "./raw/QUESTIONS.json";

export const QUESTIONS = questions as Question[];

export const QUESTION_CATEGORIES: string[] = [
  ...new Set(QUESTIONS.map((q) => q.cat)),
].sort();

export function questionsByCategory(cat: string | null): Question[] {
  if (!cat) return QUESTIONS;
  return QUESTIONS.filter((q) => q.cat === cat);
}
