import type { Aircraft, AircraftKey } from "@/types/content";
import registry from "./raw/AIRCRAFT_REGISTRY.json";

export const AIRCRAFT_REGISTRY = registry as Record<AircraftKey, Aircraft>;

export const AIRCRAFT_ORDER: AircraftKey[] = [
  "f50",
  "f50ex",
  "f900",
  "f900easy",
];

export const AIRCRAFT_LIST: Aircraft[] = AIRCRAFT_ORDER.map(
  (key) => AIRCRAFT_REGISTRY[key],
);

export function getAircraft(key: AircraftKey): Aircraft {
  return AIRCRAFT_REGISTRY[key];
}
