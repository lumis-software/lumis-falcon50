import { useState, type FormEvent, type ReactNode } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/Button";

const CODE = import.meta.env.VITE_ACCESS_CODE as string | undefined;
const STORAGE_KEY = "lumis_access_v1";

/**
 * Lightweight interim access gate for the private pilot beta.
 *
 * NOTE: this is a *soft* gate — the code is bundled client-side and only
 * deters casual access. Real per-pilot security arrives with Supabase Auth.
 * Enabled only when VITE_ACCESS_CODE is set; otherwise renders children.
 */
export function AccessGate({ children }: { children: ReactNode }) {
  const enabled = Boolean(CODE);
  const [unlocked, setUnlocked] = useState(() => {
    if (!enabled) return true;
    try {
      return localStorage.getItem(STORAGE_KEY) === CODE;
    } catch {
      return false;
    }
  });
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (entry.trim() === CODE) {
      try {
        localStorage.setItem(STORAGE_KEY, entry.trim());
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-900/70 p-7 text-center shadow-xl [animation:var(--animate-rise)]"
      >
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-xl bg-ink-800 text-brand-400">
          <LockKeyhole size={22} />
        </div>
        <h1 className="text-lg font-bold">Lumis Falcon Trainer</h1>
        <p className="mt-1 text-sm text-ink-400">
          Private beta — enter your access code to continue.
        </p>
        <input
          type="password"
          value={entry}
          onChange={(e) => {
            setEntry(e.target.value);
            setError(false);
          }}
          placeholder="Access code"
          autoFocus
          className="mt-5 w-full rounded-xl border border-ink-700 bg-ink-950 px-4 py-3 text-center text-sm focus:border-brand-500 focus:outline-none"
        />
        {error && (
          <p className="mt-2 text-xs text-red-400">
            Incorrect code. Contact Steve for access.
          </p>
        )}
        <Button type="submit" size="lg" fullWidth className="mt-4">
          Enter
        </Button>
      </form>
    </div>
  );
}
