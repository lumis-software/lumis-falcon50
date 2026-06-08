import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAircraft } from "@/providers/AircraftProvider";

interface HeaderProps {
  subtitle?: string;
  /** When set, overrides the default browser-back navigation. */
  onBack?: () => void;
  showBack?: boolean;
}

export function Header({ subtitle, onBack, showBack = true }: HeaderProps) {
  const navigate = useNavigate();
  const { aircraft } = useAircraft();

  const handleBack = () => (onBack ? onBack() : navigate(-1));

  return (
    <header className="sticky top-0 z-20 border-b border-ink-800 bg-ink-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-3">
        {showBack ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-ink-300 transition-colors hover:bg-ink-800 hover:text-white"
            aria-label="Back"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        ) : (
          <span className="w-12" />
        )}
        <div className="flex-1 text-center">
          <div className="text-lg font-bold tracking-wide">
            {aircraft.name.toUpperCase()}
          </div>
          {subtitle && (
            <div className="text-[11px] uppercase tracking-widest text-ink-400">
              {subtitle}
            </div>
          )}
        </div>
        <span className="w-12" />
      </div>
    </header>
  );
}
