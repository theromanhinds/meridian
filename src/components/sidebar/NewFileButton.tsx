import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const FOLDERS = ["notes", "specs", "prompts", "archive"];

export function NewFileButton() {
  const [open, setOpen] = useState(false);
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
        className="w-full py-2 text-sm text-[#555] hover:text-[#7c6af7] border border-[#2a2a2a] hover:border-[#7c6af7] rounded transition-colors"
      >
        + New File
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setOpen(false); }}
        placeholder="File title..."
        className="bg-[#0d0d0d] border border-[#7c6af7] rounded px-2 py-1.5 text-sm text-[#e2e2e2] placeholder-[#444] focus:outline-none"
      />
      <select
        value={folder}
        onChange={e => setFolder(e.target.value)}
        className="bg-[#0d0d0d] border border-[#2a2a2a] rounded px-2 py-1.5 text-sm text-[#888] focus:outline-none"
      >
        {FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      <div className="flex gap-2">
        <button onClick={handleCreate} className="flex-1 py-1.5 bg-[#7c6af7] text-white text-sm rounded hover:bg-[#6b5ae6] transition-colors">
          Create
        </button>
        <button onClick={() => setOpen(false)} className="flex-1 py-1.5 bg-[#2a2a2a] text-[#888] text-sm rounded hover:bg-[#333] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}
