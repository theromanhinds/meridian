import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

interface Props {
  fileSlug: string;
  onRequestRefine: () => void;
}

export function QuickActions({ fileSlug, onRequestRefine }: Props) {
  const file = useQuery(api.files.getBySlug, { slug: fileSlug });
  const updateStatus = useMutation(api.files.updateStatus);
  const saveAsNote = useMutation(api.chat.saveAsNote);

  const markSpecReady = () => {
    if (file) updateStatus({ id: file._id as Id<"files">, status: "spec_ready" });
  };

  const handleSaveChatAsNote = async () => {
    if (file) await saveAsNote({ fileId: file._id as Id<"files">, title: `Chat: ${file.title}` });
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={onRequestRefine}
        title="Refine with AI"
        className="px-2 py-1 text-xs bg-[#7c6af720] text-[#7c6af7] rounded hover:bg-[#7c6af730] transition-colors"
      >
        Refine
      </button>
      <button
        onClick={markSpecReady}
        title="Mark as Spec Ready"
        className="px-2 py-1 text-xs bg-[#4ade8015] text-[#4ade80] rounded hover:bg-[#4ade8025] transition-colors"
      >
        → Spec
      </button>
      <button
        onClick={handleSaveChatAsNote}
        title="Save chat as note"
        className="px-2 py-1 text-xs bg-[#2a2a2a] text-[#888] rounded hover:bg-[#333] transition-colors"
      >
        Save Chat
      </button>
    </div>
  );
}
