import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface Props {
  fileSlug: string;
  onRequestRefine: () => void;
}

function MoreIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <circle cx="3"  cy="8" r="1.3" />
      <circle cx="8"  cy="8" r="1.3" />
      <circle cx="13" cy="8" r="1.3" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 7L5 9.5 11.5 3" />
    </svg>
  );
}

export function QuickActions({ fileSlug, onRequestRefine }: Props) {
  const file = useQuery(api.files.getBySlug, { slug: fileSlug });
  const updateStatus = useMutation(api.files.updateStatus);
  const saveAsNote = useMutation(api.chat.saveAsNote);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markSpecReady = () => {
    if (file) updateStatus({ id: file._id as Id<"files">, status: "spec_ready" });
    setOpen(false);
  };
  const handleSaveChatAsNote = async () => {
    if (file) await saveAsNote({ fileId: file._id as Id<"files">, title: `Chat: ${file.title}` });
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onRequestRefine}
        className="pill text-xs h-7 px-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        title="Refine document with AI"
      >
        <SparkleIcon />
        Refine
      </button>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="More actions"
          className="pill-icon-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <MoreIcon />
        </button>
        {open && (
          <div className="absolute top-full right-0 mt-1.5 glass-strong rounded-lg shadow-pop z-50 min-w-[200px] overflow-hidden p-1 animate-fade-up">
            <button
              onClick={markSpecReady}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-ink-2 hover:bg-layer-2 hover:text-ink-1 transition-colors duration-fast text-left"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-ok" />
              Mark spec ready
            </button>
            <button
              onClick={handleSaveChatAsNote}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-ink-2 hover:bg-layer-2 hover:text-ink-1 transition-colors duration-fast text-left"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2.5h6.5L11.5 4.5v7a1 1 0 01-1 1h-7a1 1 0 01-1-1v-8a1 1 0 011-1zM5 6h4M5 8h4M5 10h2.5" />
              </svg>
              Save chat as note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
