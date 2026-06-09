import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface AccordionItemProps {
  title: ReactNode;
  meta?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
  accentClass?: string;
  children: ReactNode;
}

export function AccordionItem({
  title,
  meta,
  defaultOpen = false,
  open,
  onToggle,
  accentClass = "border-ink-700",
  children,
}: AccordionItemProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  const toggle = onToggle ?? (() => setInternal((v) => !v));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-ink-900/60",
        accentClass,
      )}
    >
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-ink-900/90"
        aria-expanded={isOpen}
      >
        <span className="font-semibold">{title}</span>
        <span className="flex items-center gap-2 text-sm text-ink-500">
          {meta}
          <ChevronDown
            size={16}
            className={cn("transition-transform", isOpen && "rotate-180")}
          />
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 [animation:var(--animate-fade-in)]">
          {children}
        </div>
      )}
    </div>
  );
}
