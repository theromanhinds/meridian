import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const FOLDERS = [
  { id: "notes",   label: "Notes" },
  { id: "specs",   label: "Specs" },
  { id: "prompts", label: "Prompts" },
  { id: "archive", label: "Archive" },
];

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M7 2v10M2 7h10" />
    </svg>
  );
}

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewFileButton({ open: openProp, onOpenChange }: Props = {}) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = onOpenChange ?? setOpenState;

  const [title, setTitle] = useState("");
  const [folder, setFolder] = useState("notes");
  const create = useMutation(api.files.create);

  const handleCreate = async () => {
    if (!title.trim()) return;
    await create({ title: title.trim(), folder });
    setTitle("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 h-9 pill-primary text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <PlusIcon />
        <span>New file</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 animate-fade-up">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setOpen(false); }}
        placeholder="File title…"
        className="bg-layer-2 rounded-md px-3 h-9 text-sm input-bare"
      />
      <div className="flex gap-1.5 flex-wrap">
        {FOLDERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFolder(f.id)}
            className={`pill text-xs h-7 px-2.5 ${
              folder === f.id ? "bg-layer-4 text-ink-1" : ""
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setOpen(false)}
          className="flex-1 h-9 pill text-sm justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="flex-1 h-9 pill-primary rounded-full text-sm flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Create
        </button>
      </div>
    </div>
  );
}
