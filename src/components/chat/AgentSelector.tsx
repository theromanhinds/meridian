import { useEffect, useRef, useState } from "react";
import { AI_PROVIDERS } from "../../lib/firebase";
import type { AgentType } from "../../hooks/useChatSession";

interface Props {
  value: AgentType;
  onChange: (v: AgentType) => void;
}

const AGENTS: { id: AgentType; label: string; available: () => boolean }[] = [
  { id: "direct",   label: "Gemini",   available: () => true },
  { id: "roman_ii", label: "Roman II", available: () => AI_PROVIDERS.roman_ii.available },
  { id: "learning", label: "Claude",   available: () => AI_PROVIDERS.anthropic.available },
];

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5L6 7.5l3-3" />
    </svg>
  );
}

export function AgentSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = AGENTS.find(a => a.id === value) ?? AGENTS[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="pill text-xs h-7 px-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-ink-1 font-medium">{current.label}</span>
        <span className="text-ink-3"><ChevronDown /></span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 glass-strong rounded-lg shadow-pop z-50 min-w-[180px] overflow-hidden p-1 animate-fade-up">
          {AGENTS.map(agent => {
            const disabled = !agent.available();
            const active = agent.id === value;
            return (
              <button
                key={agent.id}
                disabled={disabled}
                onClick={() => { onChange(agent.id); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors duration-fast text-left disabled:opacity-40 disabled:cursor-not-allowed ${
                  active ? "bg-layer-3 text-ink-1" : "hover:bg-layer-2 text-ink-2"
                }`}
              >
                <span className="flex-1">{agent.label}</span>
                {disabled && <span className="text-2xs text-ink-4">unavailable</span>}
                {active && !disabled && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.5l2.5 2.5L10 3.5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
