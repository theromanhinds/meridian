import { useState, useCallback } from "react";
import { useFile } from "../../hooks/useFile";
import { TiptapEditor } from "../editor/TiptapEditor";
import { DiffViewer } from "../editor/DiffViewer";
import { DiffActionBar } from "../editor/DiffActionBar";
import { PromptBanner } from "../editor/PromptBanner";
import { StatusBadge } from "../editor/StatusBadge";
import { parseAIDiff, applyDiff } from "../../lib/diff";
import type { DiffChunk } from "../../lib/diff";
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
  const [lastProcessedDiff, setLastProcessedDiff] = useState<string | null>(null);

  if (pendingDiff && pendingDiff !== lastProcessedDiff) {
    setLastProcessedDiff(pendingDiff);
    setDiffChunks(parseAIDiff(pendingDiff));
  }

  const handleAcceptAll = useCallback(() => {
    if (!diffChunks || !file) return;
    const result = applyDiff(diffChunks, new Set());
    saveContent(file._id as Id<"files">, result);
    setDiffChunks(null);
    setLastProcessedDiff(null);
    onDiffCleared?.();
  }, [diffChunks, file, saveContent, onDiffCleared]);

  const handleRejectAll = useCallback(() => {
    if (!diffChunks || !file) return;
    const allRemoveIds = new Set(diffChunks.filter(c => c.type === "remove").map(c => c.id));
    const result = applyDiff(diffChunks, allRemoveIds);
    saveContent(file._id as Id<"files">, result);
    setDiffChunks(null);
    setLastProcessedDiff(null);
    onDiffCleared?.();
  }, [diffChunks, file, saveContent, onDiffCleared]);

  if (!file) {
    return (
      <div className={`relative flex items-center justify-center ${className ?? ""}`}>
        <div className="text-center px-8 max-w-sm">
          <div className="w-12 h-12 mx-auto mb-5 rounded-full flex items-center justify-center bg-layer-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ink-2">
              <rect x="4" y="3" width="16" height="18" rx="3" />
              <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
          </div>
          <p className="text-md text-ink-1 font-medium">A blank canvas awaits</p>
          <p className="text-sm text-ink-3 mt-1.5">
            Open a file from the sidebar, or press{" "}
            <kbd className="text-2xs font-mono text-ink-2 px-1.5 py-0.5 mx-0.5 rounded bg-layer-2">⌘K</kbd>{" "}
            to search.
          </p>
        </div>
      </div>
    );
  }

  const showingDiff = diffChunks && diffChunks.length > 0;
  const keepCount = diffChunks?.filter(c => c.type === "keep").length ?? 0;
  const removeCount = diffChunks?.filter(c => c.type === "remove").length ?? 0;

  return (
    <div className={`flex flex-col bg-bg-app ${className ?? ""}`}>
      <header className="flex items-center justify-between px-5 h-12 border-b border-line flex-shrink-0">
        <h2 className="text-sm font-medium text-ink-1 truncate tracking-tight">
          {file.title}
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="badge tabular-nums">
            {file.wordCount.toLocaleString()} words
          </span>
          <StatusBadge fileId={file._id as Id<"files">} status={file.status} />
        </div>
      </header>

      {file.folder === "prompts" && <PromptBanner filename={file.slug} />}

      {showingDiff && (
        <DiffActionBar
          keepCount={keepCount}
          removeCount={removeCount}
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
        />
      )}

      <div className="flex-1 min-h-0 overflow-hidden">
        {showingDiff ? (
          <DiffViewer chunks={diffChunks!} />
        ) : (
          <TiptapEditor
            content={file.content}
            onChange={val => saveContent(file._id as Id<"files">, val)}
          />
        )}
      </div>
    </div>
  );
}
