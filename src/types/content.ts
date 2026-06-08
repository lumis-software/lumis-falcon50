export type AircraftKey = "f50" | "f50ex" | "f900" | "f900easy";

export type AircraftStatus = "deep" | "scaffolded";

export interface Aircraft {
  key: AircraftKey;
  name: string;
  short: string;
  typeRating: string;
  icon: string;
  color: string;
  status: AircraftStatus;
  engines: string;
  enginePower: string;
  fadec: string;
  mtow: string;
  range: string;
  pax: string;
  avionics: string;
  apu: string;
  note: string;
}

export interface Question {
  q: string;
  choices: string[];
  /** Index into `choices` of the correct answer. */
  a: number;
  cat: string;
}

export interface LimitationCategory {
  cat: string;
  items: { k: string; v: string }[];
}

export interface MemoryItem {
  title: string;
  cues?: string[];
  steps: string[];
}

export interface Procedure {
  id: string;
  title: string;
  type: string;
  steps: string[];
}
