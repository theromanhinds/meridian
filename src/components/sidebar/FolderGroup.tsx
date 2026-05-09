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
  folder: { id: string; label: string; icon: string };
  files: FileData[];
  activeSlug: string | null;
  onFileSelect: (slug: string) => void;
}

export function FolderGroup({ folder, files, activeSlug, onFileSelect }: Props) {
  const [open, setOpen] = useState(folder.id !== "archive");

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#555] hover:text-[#888] uppercase tracking-wider transition-colors"
      >
        <span>{folder.icon}</span>
        <span>{folder.label}</span>
        <span className="ml-auto text-[#333]">{files.length}</span>
        <span className="text-[#333]">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="px-1 space-y-0.5">
          {files.map(f => (
            <FileItem key={f._id} file={f} isActive={activeSlug === f.slug} onSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
