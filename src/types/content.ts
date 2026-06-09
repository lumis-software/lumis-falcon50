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

export interface SystemCard {
  name: string;
  icon: string;
  sysKey?: string;
  desc: string;
  keys: string[];
}

export interface OralQuestion {
  cat: string;
  q: string;
  a: string;
}

export type OralBank = Record<"shared" | AircraftKey, OralQuestion[]>;

export interface TrainerStep {
  ctrl: string;
  target: string;
  action: string;
  note?: string;
}

export interface TrainerProcedure {
  id: string;
  category: string;
  name: string;
  desc: string;
  steps: TrainerStep[];
}

export interface CockpitControl {
  panel: string;
  type: string;
  states: string[];
  def: number;
  label: string;
  x: number;
  y: number;
  group: string;
}

export type Cockpit = Record<string, CockpitControl>;

/** Engine state within a flight phase. */
export interface PhaseEngine {
  run: boolean;
  n1: number;
  n2: number;
  itt: number;
}

export interface PhaseState {
  eng: PhaseEngine[];
  apu: { run: boolean; n1: number; itt: number; gen: boolean; bleed: boolean };
  gen: boolean[];
  battery: boolean;
  gpu: boolean;
  busTie: string;
  buses: Record<string, boolean>;
  stbyPump: boolean;
  hyd: number[];
  bleed: { iso: string; prv: boolean; crew: boolean; cabin: boolean };
  cabinAlt: number;
  cabinDiff: number;
  gear: "up" | "down" | "transit_up";
  flap: number;
  slat: boolean;
  airbrake: boolean;
  lights: Record<string, boolean>;
  pitotHeat: boolean;
  antiIce: { eng: boolean; wing: boolean; wshld: boolean };
  transponder: string;
  autopilot: boolean;
  yawDamp: boolean;
  reverser?: boolean;
}

export interface FlightPhase {
  id: string;
  name: string;
  short: string;
  icon: string;
  color: string;
  description: string;
  checklist: string[];
  state: PhaseState;
}
