import { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface Props { onSelect: (slug: string) => void; }

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
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search files... (Ctrl+K)"
        className="w-full bg-[#161616] border border-[#2a2a2a] rounded px-3 py-1.5 text-sm text-[#e2e2e2] placeholder-[#444] focus:outline-none focus:border-[#7c6af7] transition-colors"
      />
      {open && results && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#161616] border border-[#2a2a2a] rounded shadow-xl z-50 max-h-60 overflow-y-auto">
          {results.map(f => (
            <button
              key={f._id}
              onMouseDown={() => { onSelect(f.slug); setQuery(""); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm text-[#ccc] hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="font-medium">{f.title}</div>
              <div className="text-xs text-[#555]">{f.folder}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
