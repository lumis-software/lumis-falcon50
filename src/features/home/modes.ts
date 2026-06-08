import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BookOpen,
  GraduationCap,
  Layers,
  ListChecks,
  Plane,
  RotateCcw,
  ScrollText,
  Settings2,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import type { Accent } from "@/components/ui/Card";

export interface StudyMode {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
  path: string;
  /** False while still being migrated to the new stack. */
  ready: boolean;
}

export const STUDY_MODES: StudyMode[] = [
  {
    id: "quiz",
    title: "Quiz Mode",
    description: "Multiple-choice questions across every system and category.",
    icon: GraduationCap,
    accent: "brand",
    path: "/quiz",
    ready: true,
  },
  {
    id: "study",
    title: "Study Mode",
    description: "Flashcards — flip to reveal answers at your own pace.",
    icon: BookOpen,
    accent: "purple",
    path: "/study",
    ready: false,
  },
  {
    id: "memory",
    title: "Memory Items",
    description: "Immediate-action / bold-face items to commit to memory.",
    icon: AlertTriangle,
    accent: "red",
    path: "/memory",
    ready: false,
  },
  {
    id: "limits",
    title: "Limitations",
    description: "Searchable — speeds, weights, engine, electrical, and more.",
    icon: SlidersHorizontal,
    accent: "amber",
    path: "/limits",
    ready: false,
  },
  {
    id: "systems",
    title: "Systems & Schematics",
    description: "Interactive diagrams, failure scenarios, animated flow.",
    icon: Settings2,
    accent: "emerald",
    path: "/systems",
    ready: false,
  },
  {
    id: "trainer",
    title: "Procedure Trainer",
    description: "Learn by doing — guided or free-form cockpit practice.",
    icon: ListChecks,
    accent: "emerald",
    path: "/trainer",
    ready: false,
  },
  {
    id: "phases",
    title: "Live Flight Phases",
    description: "Walk start → taxi → cruise → shutdown and watch systems react.",
    icon: Plane,
    accent: "sky",
    path: "/phases",
    ready: false,
  },
  {
    id: "procedures",
    title: "Procedures",
    description: "Normal and emergency / abnormal checklists.",
    icon: ScrollText,
    accent: "sky",
    path: "/procedures",
    ready: false,
  },
  {
    id: "oral",
    title: "Checkride Oral Prep",
    description: "Examiner-style questions with model answers.",
    icon: Sparkles,
    accent: "brand",
    path: "/oral",
    ready: false,
  },
  {
    id: "differences",
    title: "Differences & Specs",
    description: "Per-aircraft limits, deltas, and accident case studies.",
    icon: Layers,
    accent: "amber",
    path: "/differences",
    ready: false,
  },
  {
    id: "missed",
    title: "Review Missed",
    description: "Re-study the questions you got wrong.",
    icon: RotateCcw,
    accent: "red",
    path: "/missed",
    ready: false,
  },
];
