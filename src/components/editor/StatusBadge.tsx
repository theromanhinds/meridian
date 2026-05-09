import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { StatusPill } from "../shared/StatusPill";

const STATUSES = ["draft", "refining", "spec_ready", "in_build", "complete"];

interface Props { fileId: Id<"files">; status: string; }

export function StatusBadge({ fileId, status }: Props) {
  const [open, setOpen] = useState(false);
  const updateStatus = useMutation(api.files.updateStatus);

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}><StatusPill status={status} /></button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-[#161616] border border-[#2a2a2a] rounded shadow-xl z-50">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { updateStatus({ id: fileId, status: s }); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-[#2a2a2a] transition-colors"
            >
              <StatusPill status={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
