import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { StatusPill } from "../shared/StatusPill";

const STATUSES = ["draft", "refining", "spec_ready", "in_build", "complete"];

interface Props { fileId: Id<"files">; status: string; }

export function StatusBadge({ fileId, status }: Props) {
  const [open, setOpen] = useState(false);
  const updateStatus = useMutation(api.files.updateStatus);
  const ref = useRef<HTMLDivElement>(null);

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
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-full"
        aria-label="Change status"
      >
        <StatusPill status={status} interactive />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2 glass-strong rounded-xl shadow-pop z-50 min-w-[180px] overflow-hidden p-1 animate-fade-up">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { updateStatus({ id: fileId, status: s }); setOpen(false); }}
              className="flex items-center w-full px-2 py-1.5 rounded-lg hover:bg-layer-2 transition-colors duration-fast text-left"
            >
              <StatusPill status={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
