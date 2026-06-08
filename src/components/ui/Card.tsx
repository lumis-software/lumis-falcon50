import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Accent =
  | "slate"
  | "brand"
  | "emerald"
  | "amber"
  | "red"
  | "sky"
  | "purple";

const ACCENT_BORDER: Record<Accent, string> = {
  slate: "border-ink-700 hover:border-ink-600",
  brand: "border-brand-500/50 hover:border-brand-400",
  emerald: "border-emerald-500/50 hover:border-emerald-400",
  amber: "border-amber-500/50 hover:border-amber-400",
  red: "border-red-500/50 hover:border-red-400",
  sky: "border-sky-500/50 hover:border-sky-400",
  purple: "border-purple-500/50 hover:border-purple-400",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: Accent;
  interactive?: boolean;
  children: ReactNode;
}

export function Card({
  accent = "slate",
  interactive,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border bg-ink-900/60 backdrop-blur-sm shadow-lg",
        ACCENT_BORDER[accent],
        interactive &&
          "cursor-pointer transition-all hover:bg-ink-900/90 hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
