import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Aircraft, AircraftKey } from "@/types/content";
import { AIRCRAFT_ORDER, getAircraft } from "@/data/aircraft";

const STORAGE_KEY = "lumis_aircraft_v1";

interface AircraftState {
  aircraftKey: AircraftKey;
  aircraft: Aircraft;
  setAircraft: (key: AircraftKey) => void;
}

const AircraftContext = createContext<AircraftState | null>(null);

function readInitial(): AircraftKey {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as AircraftKey | null;
    if (saved && AIRCRAFT_ORDER.includes(saved)) return saved;
  } catch {
    /* ignore */
  }
  return "f50";
}

export function AircraftProvider({ children }: { children: ReactNode }) {
  const [aircraftKey, setKey] = useState<AircraftKey>(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, aircraftKey);
    } catch {
      /* ignore */
    }
  }, [aircraftKey]);

  const setAircraft = useCallback((key: AircraftKey) => setKey(key), []);

  const value = useMemo<AircraftState>(
    () => ({ aircraftKey, aircraft: getAircraft(aircraftKey), setAircraft }),
    [aircraftKey, setAircraft],
  );

  return <AircraftContext value={value}>{children}</AircraftContext>;
}

export function useAircraft(): AircraftState {
  const ctx = use(AircraftContext);
  if (!ctx) throw new Error("useAircraft must be used within <AircraftProvider>");
  return ctx;
}
