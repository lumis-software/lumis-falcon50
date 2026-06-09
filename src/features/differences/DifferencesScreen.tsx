import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { useAircraft } from "@/providers/AircraftProvider";

const SPEC_ROWS: { label: string; key: keyof SpecKeys }[] = [
  { label: "Type rating", key: "typeRating" },
  { label: "Engines", key: "engines" },
  { label: "Engine power", key: "enginePower" },
  { label: "Engine control", key: "fadec" },
  { label: "MTOW", key: "mtow" },
  { label: "Range", key: "range" },
  { label: "Passengers", key: "pax" },
  { label: "Avionics", key: "avionics" },
  { label: "APU", key: "apu" },
];

type SpecKeys = {
  typeRating: string;
  engines: string;
  enginePower: string;
  fadec: string;
  mtow: string;
  range: string;
  pax: string;
  avionics: string;
  apu: string;
};

export function DifferencesScreen() {
  const { aircraft } = useAircraft();

  return (
    <div>
      <Header subtitle="Differences & Specs" showBack />
      <div className="mx-auto max-w-3xl px-5 py-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="text-4xl">{aircraft.icon}</div>
          <div>
            <h2 className="text-xl font-bold">{aircraft.name}</h2>
            <span
              className={
                "text-[11px] uppercase tracking-wide " +
                (aircraft.status === "deep"
                  ? "text-emerald-400"
                  : "text-amber-400")
              }
            >
              {aircraft.status === "deep"
                ? "Full content set"
                : "Preview — deep content in progress"}
            </span>
          </div>
        </div>

        <Card accent="amber" className="overflow-hidden">
          <div className="divide-y divide-ink-800">
            {SPEC_ROWS.map((row) => (
              <div
                key={row.key}
                className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <div className="text-xs uppercase tracking-wide text-ink-400 sm:w-40 sm:shrink-0">
                  {row.label}
                </div>
                <div className="text-sm text-ink-100 sm:flex-1 sm:text-right">
                  {aircraft[row.key]}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-5 rounded-xl border border-ink-700 bg-ink-900/60 p-4 text-sm leading-relaxed text-ink-300">
          {aircraft.note}
        </div>

        <p className="mt-6 text-center text-[11px] text-ink-500">
          Type-specific differences, systems deltas, and accident case studies
          are being expanded for each airframe.
        </p>
      </div>
    </div>
  );
}
