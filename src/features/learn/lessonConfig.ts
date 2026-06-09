import { SYSTEMS } from "@/data/content";
import { QUESTIONS } from "@/data/questions";
import type { Question } from "@/types/content";

export type StepKind = "read" | "diagram" | "test";

export interface LessonStep {
  id: string;
  title: string;
  /** Short verb shown under the title, e.g. "Read & listen". */
  modeLabel: string;
  kind: StepKind;
}

export interface Lesson {
  id: string;
  name: string;
  icon: string;
  desc: string;
  keys: string[];
  /** Schematic key into the interactive engine, when one exists. */
  sysKey?: string;
  steps: LessonStep[];
  quizDeck: Question[];
}

/** System keys that have an interactive schematic in the engine. */
const SCHEMATIC_KEYS = new Set([
  "bleed",
  "env",
  "dcelec",
  "acelec",
  "fuel",
  "hyd",
  "fc",
  "ai",
  "pp",
  "gear",
]);

/**
 * How each system maps onto the 164-question bank. Prefer exact categories;
 * fall back to keyword matching for systems without a dedicated category.
 */
const QUIZ_MAP: Record<string, { cats?: string[]; keywords?: string[] }> = {
  Powerplant: { cats: ["Engine"] },
  APU: { cats: ["APU"] },
  Hydraulics: { cats: ["Hydraulics"] },
  Electrical: { cats: ["Electrical"] },
  Fuel: { cats: ["Fuel"] },
  "Pneumatics / Bleed Air": { cats: ["Bleed Air"] },
  "Environmental / Pressurization": {
    keywords: ["press", "cabin", "environ", "condition", "outflow", "bleed"],
  },
  "Flight Controls": { cats: ["Flight Controls"] },
  Avionics: { cats: ["Avionics"] },
  "Anti-Ice & Rain": { cats: ["Anti-Ice"] },
  "Landing Gear & Brakes": {
    keywords: ["gear", "brake", "tire", "antiskid", "steering", "nose wheel"],
  },
  "Thrust Reverser": { cats: ["Thrust Reverser"] },
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function deckFor(name: string): Question[] {
  const map = QUIZ_MAP[name];
  if (!map) return [];
  if (map.cats) {
    const byCat = QUESTIONS.filter((q) => map.cats!.includes(q.cat));
    if (byCat.length) return byCat;
  }
  if (map.keywords) {
    const kw = map.keywords;
    return QUESTIONS.filter((q) =>
      kw.some((k) => q.q.toLowerCase().includes(k)),
    );
  }
  return [];
}

function buildLesson(sys: (typeof SYSTEMS)[number]): Lesson {
  const hasSchematic = !!sys.sysKey && SCHEMATIC_KEYS.has(sys.sysKey);
  const quizDeck = deckFor(sys.name);

  const steps: LessonStep[] = [
    {
      id: "overview",
      title: "Overview",
      modeLabel: "Read & listen",
      kind: "read",
    },
  ];
  if (hasSchematic) {
    steps.push({
      id: "diagram",
      title: "See & Hear",
      modeLabel: "Interactive schematic",
      kind: "diagram",
    });
  }
  if (quizDeck.length > 0) {
    steps.push({
      id: "test",
      title: "Knowledge Check",
      modeLabel: `${quizDeck.length} questions`,
      kind: "test",
    });
  }

  return {
    id: slugify(sys.name),
    name: sys.name,
    icon: sys.icon,
    desc: sys.desc,
    keys: sys.keys,
    sysKey: hasSchematic ? sys.sysKey : undefined,
    steps,
    quizDeck,
  };
}

/** All lessons, in the same order the systems appear in the source data. */
export const LESSONS: Lesson[] = SYSTEMS.map(buildLesson);

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
