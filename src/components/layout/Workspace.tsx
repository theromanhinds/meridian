import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { EditorPane } from "./EditorPane";
import { ChatPane } from "./ChatPane";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { OfflineBanner } from "../shared/OfflineBanner";
import { useOfflineSync } from "../../hooks/useOfflineQueue";
import { KeyboardShortcuts } from "../shared/KeyboardShortcuts";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { usePanelResize } from "../../hooks/usePanelResize";

type MobileDrawer = null | "files" | "chat";

export function Workspace() {
  const [activeFileSlug, setActiveFileSlug] = useState<string | null>(null);
  const [pendingDiff, setPendingDiff] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [mobileDrawer, setMobileDrawer] = useState<MobileDrawer>(null);
  const isDesktop = useMediaQuery("(min-width: 800px)");

  useOfflineSync();
  useKeyboardShortcuts({ onToggleHelp: () => setShowShortcuts(s => !s) });

  // Close drawer when switching to desktop
  useEffect(() => { if (isDesktop) setMobileDrawer(null); }, [isDesktop]);

  // Lock body scroll when a drawer is open
  useEffect(() => {
    if (mobileDrawer) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileDrawer]);

  const handleFileSelect = (slug: string) => {
    setActiveFileSlug(slug);
    setPendingDiff(null);
    if (!isDesktop) setMobileDrawer(null);
  };

  const triggerSearch = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true }),
    );
  };

  const sidebar = usePanelResize({
    storageKey: "meridian.sidebar.w",
    initial: 256, min: 220, max: 380, edge: "left",
  });
  const chat = usePanelResize({
    storageKey: "meridian.chat.w",
    initial: 380, min: 320, max: 540, edge: "right",
  });

  // ─── DESKTOP ──────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-bg-app text-ink-1 font-sans">
        {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}

        <aside
          className="flex-shrink-0 bg-bg-canvas overflow-hidden"
          style={{ width: sidebar.width }}
        >
          <Sidebar activeSlug={activeFileSlug} onFileSelect={handleFileSelect} className="h-full" />
        </aside>

        <div
          className={`resize-handle ${sidebar.isDragging ? "is-dragging" : ""}`}
          onPointerDown={sidebar.onPointerDown}
          onPointerMove={sidebar.onPointerMove}
          onPointerUp={sidebar.onPointerUp}
          role="separator"
          aria-label="Resize sidebar"
        />

        <main className="flex-1 min-w-0 flex flex-col bg-bg-app overflow-hidden">
          <DesktopHeader
            activeFileSlug={activeFileSlug}
            onSearch={triggerSearch}
            onShortcuts={() => setShowShortcuts(s => !s)}
          />
          <OfflineBanner />
          <EditorPane
            fileSlug={activeFileSlug}
            pendingDiff={pendingDiff}
            onDiffCleared={() => setPendingDiff(null)}
            className="flex-1 min-h-0"
          />
        </main>

        <div
          className={`resize-handle ${chat.isDragging ? "is-dragging" : ""}`}
          onPointerDown={chat.onPointerDown}
          onPointerMove={chat.onPointerMove}
          onPointerUp={chat.onPointerUp}
          role="separator"
          aria-label="Resize chat"
        />

        <aside
          className="flex-shrink-0 bg-bg-canvas overflow-hidden"
          style={{ width: chat.width }}
        >
          <ChatPane fileSlug={activeFileSlug} onPendingDiff={setPendingDiff} className="h-full" />
        </aside>
      </div>
    );
  }

  // ─── MOBILE ───────────────────────────────────────────────────
  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-bg-app text-ink-1 font-sans flex flex-col">
      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}

      <MobileHeader
        activeFileSlug={activeFileSlug}
        onOpenFiles={() => setMobileDrawer("files")}
        onOpenChat={() => setMobileDrawer("chat")}
      />
      <OfflineBanner />

      <main className="flex-1 min-h-0 overflow-hidden">
        <EditorPane
          fileSlug={activeFileSlug}
          pendingDiff={pendingDiff}
          onDiffCleared={() => setPendingDiff(null)}
          className="h-full"
        />
      </main>

      {/* Drawer overlay */}
      {mobileDrawer && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/55 animate-fade-in"
            onClick={() => setMobileDrawer(null)}
            aria-hidden
          />
          {mobileDrawer === "files" && (
            <aside
              className="fixed top-0 bottom-0 left-0 z-50 w-[88vw] max-w-[360px] bg-bg-canvas glass-strong flex flex-col animate-slide-right safe-top"
              role="dialog"
              aria-label="Files"
            >
              <DrawerHeader title="Files" onClose={() => setMobileDrawer(null)} />
              <Sidebar
                activeSlug={activeFileSlug}
                onFileSelect={handleFileSelect}
                className="flex-1 min-h-0"
              />
            </aside>
          )}
          {mobileDrawer === "chat" && (
            <aside
              className="fixed top-0 bottom-0 right-0 z-50 w-[92vw] max-w-[420px] bg-bg-canvas glass-strong flex flex-col animate-slide-left safe-top"
              role="dialog"
              aria-label="Assistant"
            >
              <DrawerHeader title="Assistant" onClose={() => setMobileDrawer(null)} />
              <ChatPane
                fileSlug={activeFileSlug}
                onPendingDiff={(d) => { setPendingDiff(d); setMobileDrawer(null); }}
                className="flex-1 min-h-0"
              />
            </aside>
          )}
        </>
      )}
    </div>
  );
}

/* ── Desktop header ───────────────────────────────────────────── */
function DesktopHeader({
  activeFileSlug,
  onSearch,
  onShortcuts,
}: {
  activeFileSlug: string | null;
  onSearch: () => void;
  onShortcuts: () => void;
}) {
  return (
    <header className="flex items-center h-12 px-4 gap-2 border-b border-line flex-shrink-0">
      <button
        onClick={onSearch}
        className="flex items-center gap-2 h-7 px-2.5 rounded-md text-ink-3 hover:text-ink-1 hover:bg-layer-2 transition-colors duration-fast text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <SearchIcon size={13} />
        <span>Search</span>
        <kbd className="ml-1 text-[10px] text-ink-4 font-mono">⌘K</kbd>
      </button>
      <span className="ml-1 text-ink-4 text-xs select-none">·</span>
      <span className="text-ink-2 text-xs truncate max-w-[40vw]">
        {activeFileSlug ?? "No file open"}
      </span>
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onShortcuts}
          aria-label="Keyboard shortcuts"
          title="Shortcuts (?)"
          className="pill-icon-sm pill-ghost"
        >
          <KeyboardIcon size={14} />
        </button>
      </div>
    </header>
  );
}

/* ── Mobile header ────────────────────────────────────────────── */
function MobileHeader({
  activeFileSlug,
  onOpenFiles,
  onOpenChat,
}: {
  activeFileSlug: string | null;
  onOpenFiles: () => void;
  onOpenChat: () => void;
}) {
  return (
    <header className="flex items-center h-12 px-3 gap-2 border-b border-line flex-shrink-0 safe-top">
      <button onClick={onOpenFiles} aria-label="Open files" className="pill-icon-sm">
        <MenuIcon size={16} />
      </button>
      <span className="flex-1 text-center text-xs text-ink-2 truncate px-2">
        {activeFileSlug ?? "Meridian"}
      </span>
      <button onClick={onOpenChat} aria-label="Open assistant" className="pill-icon-sm">
        <ChatIcon size={16} />
      </button>
    </header>
  );
}

function DrawerHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center h-12 px-4 border-b border-line flex-shrink-0">
      <span className="label-mute">{title}</span>
      <button onClick={onClose} aria-label="Close" className="ml-auto pill-icon-sm">
        <XIcon size={14} />
      </button>
    </div>
  );
}

/* ── Glyphs ───────────────────────────────────────────────────── */
function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L13.5 13.5" />
    </svg>
  );
}
function KeyboardIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="4" width="13" height="9" rx="2" />
      <path d="M4 8.5h.5M7.75 8.5h.5M11.5 8.5h.5M5 11h6" />
    </svg>
  );
}
function MenuIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
    </svg>
  );
}
function ChatIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4.5h14v9H11l-3.5 3v-3H3v-9z" />
    </svg>
  );
}
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 2l10 10M12 2L2 12" />
    </svg>
  );
}
