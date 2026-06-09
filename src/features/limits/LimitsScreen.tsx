import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { SearchInput } from "@/components/ui/SearchInput";
import { LIMITATIONS } from "@/data/content";

export function LimitsScreen() {
  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return LIMITATIONS;
    return LIMITATIONS.map((c) => ({
      cat: c.cat,
      items: c.items.filter(
        (i) =>
          i.k.toLowerCase().includes(s) || i.v.toLowerCase().includes(s),
      ),
    })).filter((c) => c.items.length > 0);
  }, [search]);

  const searching = search.trim().length > 0;

  return (
    <div>
      <Header subtitle="Limitations" showBack />
      <div className="mx-auto max-w-3xl px-5 py-5">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search limitations (e.g. 'VMO', 'ITT', 'fuel')…"
        />
        <div className="mt-4 space-y-2">
          {filtered.map((c) => {
            const open = searching || openCat === c.cat;
            return (
              <div
                key={c.cat}
                className="overflow-hidden rounded-xl border border-amber-700/40 bg-ink-900/60"
              >
                <button
                  onClick={() => setOpenCat(openCat === c.cat ? null : c.cat)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-ink-900/90"
                  aria-expanded={open}
                >
                  <span className="font-semibold text-amber-200">{c.cat}</span>
                  <span className="text-sm text-ink-500">
                    {c.items.length} items {open ? "▼" : "▶"}
                  </span>
                </button>
                {open && (
                  <div className="divide-y divide-ink-800 [animation:var(--animate-fade-in)]">
                    {c.items.map((it, j) => (
                      <div
                        key={j}
                        className="flex flex-col gap-1 px-4 py-2.5 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="text-sm text-ink-300 sm:flex-1 sm:pr-4">
                          {it.k}
                        </div>
                        <div className="font-mono text-sm text-amber-300 sm:text-right">
                          {it.v}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-10 text-center text-ink-500">No matches</div>
          )}
        </div>
      </div>
    </div>
  );
}
