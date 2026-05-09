import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { EditorPane } from "./EditorPane";
import { ChatPane } from "./ChatPane";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { OfflineBanner } from "../shared/OfflineBanner";
import { useOfflineSync } from "../../hooks/useOfflineQueue";
import { KeyboardShortcuts } from "../shared/KeyboardShortcuts";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";

export function Workspace() {
  const [activeFileSlug, setActiveFileSlug] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"files" | "editor" | "chat">("files");
  const [pendingDiff, setPendingDiff] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 900px)");

  useOfflineSync();
  useKeyboardShortcuts({
    onToggleHelp: () => setShowShortcuts(s => !s),
  });

  const handleFileSelect = (slug: string) => {
    setActiveFileSlug(slug);
    setPendingDiff(null);
    if (!isDesktop) setMobileTab("editor");
  };

  if (isDesktop) {
    return (
      <div className="flex h-screen w-screen bg-[#0d0d0d] text-[#e2e2e2] overflow-hidden">
        <OfflineBanner />
        {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
        <Sidebar
          activeSlug={activeFileSlug}
          onFileSelect={handleFileSelect}
          className="w-[240px] min-w-[200px] max-w-[320px] border-r border-[#2a2a2a] flex-shrink-0"
        />
        <EditorPane
          fileSlug={activeFileSlug}
          pendingDiff={pendingDiff}
          onDiffCleared={() => setPendingDiff(null)}
          className="flex-1 min-w-0 border-r border-[#2a2a2a]"
        />
        <ChatPane
          fileSlug={activeFileSlug}
          onPendingDiff={setPendingDiff}
          className="w-[380px] min-w-[300px] max-w-[480px] flex-shrink-0"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0d0d] text-[#e2e2e2]">
      <OfflineBanner />
      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
      <div className="flex-1 overflow-hidden">
        {mobileTab === "files" && (
          <Sidebar activeSlug={activeFileSlug} onFileSelect={handleFileSelect} className="h-full" />
        )}
        {mobileTab === "editor" && (
          <EditorPane
            fileSlug={activeFileSlug}
            pendingDiff={pendingDiff}
            onDiffCleared={() => setPendingDiff(null)}
            className="h-full"
          />
        )}
        {mobileTab === "chat" && (
          <ChatPane fileSlug={activeFileSlug} onPendingDiff={setPendingDiff} className="h-full" />
        )}
      </div>
      <div className="flex border-t border-[#2a2a2a] bg-[#161616]">
        {(["files", "editor", "chat"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors
              ${mobileTab === tab ? "text-[#7c6af7] border-t-2 border-[#7c6af7] -mt-[2px]" : "text-[#666]"}`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
