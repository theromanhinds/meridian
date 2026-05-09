interface Props { onClose: () => void; }

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], desc: "Search files" },
  { keys: ["Ctrl", "B"], desc: "Bold (selection)" },
  { keys: ["Ctrl", "I"], desc: "Italic (selection)" },
  { keys: ["/"],          desc: "Open command menu" },
  { keys: ["?"],          desc: "Toggle this panel" },
  { keys: ["Esc"],        desc: "Close panels / menus" },
];

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 2l10 10M12 2L2 12" />
    </svg>
  );
}

export function KeyboardShortcuts({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0, 0, 0, 0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-xl p-5 w-[360px] max-w-full shadow-xl animate-fade-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ink-1 tracking-tight">Keyboard shortcuts</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="pill-icon-sm"
          >
            <XIcon />
          </button>
        </div>
        <div className="space-y-2">
          {SHORTCUTS.map(s => (
            <div key={s.desc} className="flex items-center justify-between">
              <span className="text-sm text-ink-2">{s.desc}</span>
              <div className="flex gap-1">
                {s.keys.map(k => (
                  <kbd key={k} className="px-1.5 h-6 inline-flex items-center bg-layer-2 text-ink-2 text-2xs rounded font-mono leading-none min-w-[22px] justify-center">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
