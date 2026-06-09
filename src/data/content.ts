import type {
  Cockpit,
  FlightPhase,
  LimitationCategory,
  MemoryItem,
  OralBank,
  Procedure,
  SystemCard,
  TrainerProcedure,
} from "@/types/content";

import limitations from "./raw/LIMITATIONS.json";
import memoryItems from "./raw/MEMORY_ITEMS.json";
import systems from "./raw/SYSTEMS.json";
import procedures from "./raw/PROCEDURES.json";
import oral from "./raw/ORAL_QUESTIONS.json";
import phases from "./raw/FLIGHT_PHASES.json";
import trainer from "./raw/TRAINER_PROCEDURES.json";
import cockpit from "./raw/COCKPIT.json";

export const LIMITATIONS = limitations as LimitationCategory[];
export const MEMORY_ITEMS = memoryItems as MemoryItem[];
export const SYSTEMS = systems as SystemCard[];
export const PROCEDURES = procedures as Procedure[];
export const ORAL_QUESTIONS = oral as OralBank;
export const FLIGHT_PHASES = phases as FlightPhase[];
export const TRAINER_PROCEDURES = trainer as TrainerProcedure[];
export const COCKPIT = cockpit as Cockpit;
