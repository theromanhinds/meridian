import { useEffect } from "react";

interface ShortcutHandlers {
  onSearch?: () => void;
  onNewFile?: () => void;
  onToggleHelp?: () => void;
}

export function useKeyboardShortcuts({ onSearch, onNewFile, onToggleHelp }: ShortcutHandlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "k") { e.preventDefault(); onSearch?.(); }
      if (mod && e.key === "n") { e.preventDefault(); onNewFile?.(); }
      if (e.key === "?" && !mod) { onToggleHelp?.(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSearch, onNewFile, onToggleHelp]);
}
