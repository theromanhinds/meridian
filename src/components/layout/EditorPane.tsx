import { useState, useCallback } from "react";
import { useFile } from "../../hooks/useFile";
import { MarkdownEditor } from "../editor/MarkdownEditor";
import { DiffActionBar } from "../editor/DiffActionBar";
import { PromptBanner } from "../editor/PromptBanner";
import { StatusBadge } from "../editor/StatusBadge";
import { parseAIDiff, applyDiff } from "../../lib/diff";
import type { DiffChunk } from "../../lib/diff";
import type { DiffRange } from "../../lib/codemirror/diffExtension";
import type { Id } from "../../../convex/_generated/dataModel";

interface Props {
  fileSlug: string | null;
  className?: string;
  pendingDiff?: string | null;
  onDiffCleared?: () => void;
}

export function EditorPane({ fileSlug, className, pendingDiff, onDiffCleared }: Props) {
  const { file, saveContent } = useFile(fileSlug);
  const [diffChunks, setDiffChunks] = useState<DiffChunk[] | null>(null);
  const [diffRanges, setDiffRanges] = useState<DiffRange[]>([]);
  const [lastProcessedDiff, setLastProcessedDiff] = useState<string | null>(null);

  // Apply incoming diff from chat pane
  if (pendingDiff && pendingDiff !== lastProcessedDiff) {
    setLastProcessedDiff(pendingDiff);
    const chunks = parseAIDiff(pendingDiff);
    setDiffChunks(chunks);
    let pos = 0;
    const ranges: DiffRange[] = [];
    for (const chunk of chunks) {
      if (chunk.type !== "context") {
        ranges.push({ from: pos, to: pos + chunk.text.length, type: chunk.type, id: chunk.id });
      }
      pos += chunk.text.length;
    }
    setDiffRanges(ranges);
  }

  const handleAcceptAll = useCallback(() => {
    if (!diffChunks || !file) return;
    const result = applyDiff(diffChunks, new Set());
    saveContent(file._id as Id<"files">, result);
    setDiffChunks(null);
    setDiffRanges([]);
    setLastProcessedDiff(null);
    onDiffCleared?.();
  }, [diffChunks, file, saveContent, onDiffCleared]);

  const handleRejectAll = useCallback(() => {
    if (!diffChunks || !file) return;
    const allRemoveIds = new Set(diffChunks.filter(c => c.type === "remove").map(c => c.id));
    const result = applyDiff(diffChunks, allRemoveIds);
    saveContent(file._id as Id<"files">, result);
    setDiffChunks(null);
    setDiffRanges([]);
    setLastProcessedDiff(null);
    onDiffCleared?.();
  }, [diffChunks, file, saveContent, onDiffCleared]);

  if (!file) {
    return (
      <div className={`flex items-center justify-center bg-[#0d0d0d] ${className}`}>
        <div className="text-[#333] text-center">
          <div className="text-4xl mb-3">📝</div>
          <div className="text-sm">Select a file from the sidebar</div>
        </div>
      </div>
    );
  }

  const keepCount = diffChunks?.filter(c => c.type === "keep").length ?? 0;
  const removeCount = diffChunks?.filter(c => c.type === "remove").length ?? 0;

  return (
    <div className={`flex flex-col bg-[#0d0d0d] ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2a2a2a] bg-[#161616]">
        <h2 className="text-sm font-medium text-[#e2e2e2] truncate">{file.title}</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#444]">{file.wordCount} words</span>
          <StatusBadge fileId={file._id as Id<"files">} status={file.status} />
        </div>
      </div>

      {file.folder === "prompts" && <PromptBanner filename={file.slug} />}

      {diffChunks && diffChunks.length > 0 && (
        <DiffActionBar
          keepCount={keepCount}
          removeCount={removeCount}
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
        />
      )}

      <div className="flex-1 overflow-hidden">
        <MarkdownEditor
          content={file.content}
          onChange={val => saveContent(file._id as Id<"files">, val)}
          diffRanges={diffRanges}
        />
      </div>
    </div>
  );
}
