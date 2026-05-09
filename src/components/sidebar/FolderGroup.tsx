import { useState } from "react";
import { FileItem } from "./FileItem";

interface FileData {
  _id: string;
  title: string;
  slug: string;
  status: string;
  wordCount: number;
  updatedAt: number;
  pinnedAt?: number;
}

interface Props {
  folder: { id: string; label: string };
  files: FileData[];
  activeSlug: string | null;
  onFileSelect: (slug: string) => void;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 12 12" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 160ms" }}
    >
      <path d="M4.5 2.5L7.75 6 4.5 9.5" />
    </svg>
  );
}

export function FolderGroup({ folder, files, activeSlug, onFileSelect }: Props) {
  const [open, setOpen] = useState(folder.id !== "archive");

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-2 h-7 rounded-md text-ink-3 hover:text-ink-1 hover:bg-layer-1 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus group"
      >
        <ChevronIcon open={open} />
        <span className="label-mute group-hover:text-ink-2">{folder.label}</span>
        {files.length > 0 && (
          <span className="ml-auto text-2xs text-ink-4 tabular-nums">{files.length}</span>
        )}
      </button>
      {open && (
        <div className="pl-1 pt-0.5 pb-1 space-y-0.5">
          {files.length === 0 ? (
            <p className="px-3 py-1.5 text-xs text-ink-4 italic">Empty</p>
          ) : (
            files.map(f => (
              <FileItem key={f._id} file={f} isActive={activeSlug === f.slug} onSelect={onFileSelect} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
