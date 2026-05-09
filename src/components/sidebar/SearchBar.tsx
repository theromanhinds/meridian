import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface Props { onSelect: (slug: string) => void; }

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L13.5 13.5" />
    </svg>
  );
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useQuery(api.files.search, query.length > 1 ? { query } : "skip");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 30);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative">
      {!open ? (
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 30); }}
          className="w-full flex items-center gap-2 px-2.5 h-8 rounded-md bg-layer-1 hover:bg-layer-2 text-ink-3 hover:text-ink-2 text-sm transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <SearchIcon />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-[10px] text-ink-4 font-mono">⌘K</kbd>
        </button>
      ) : (
        <div className="flex items-center gap-2 px-2.5 h-8 rounded-md bg-layer-3">
          <span className="text-ink-2"><SearchIcon /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => { setOpen(false); setQuery(""); }, 150)}
            placeholder="Search files…"
            className="flex-1 input-bare text-sm"
          />
        </div>
      )}

      {open && results && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-xl shadow-pop z-50 overflow-hidden max-h-72 overflow-y-auto animate-fade-up">
          {results.map(f => (
            <button
              key={f._id}
              onMouseDown={() => { onSelect(f.slug); setQuery(""); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-layer-2 transition-colors duration-fast"
            >
              <div className="font-medium text-ink-1 truncate">{f.title}</div>
              <div className="text-2xs text-ink-4 mt-0.5 capitalize">{f.folder}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
