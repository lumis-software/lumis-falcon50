import { cn } from "@/lib/cn";

interface Segment<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("flex gap-1 rounded-xl bg-ink-900/60 p-1", className)}>
      {segments.map((seg) => {
        const active = seg.value === value;
        return (
          <button
            key={seg.value}
            onClick={() => onChange(seg.value)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              active
                ? "bg-brand-600 text-white shadow"
                : "text-ink-300 hover:bg-ink-800/60 hover:text-white",
            )}
            aria-pressed={active}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
