interface Props { onClose: () => void; }

const SHORTCUTS = [
  { keys: "Ctrl+K", desc: "Search files" },
  { keys: "Ctrl+N", desc: "New file" },
  { keys: "?", desc: "Toggle this overlay" },
];

export function KeyboardShortcuts({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#161616] border border-[#2a2a2a] rounded-lg p-6 min-w-[300px]" onClick={e => e.stopPropagation()}>
        <h3 className="text-[#e2e2e2] font-semibold mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-3">
          {SHORTCUTS.map(s => (
            <div key={s.keys} className="flex items-center justify-between">
              <span className="text-[#888] text-sm">{s.desc}</span>
              <kbd className="px-2 py-1 bg-[#2a2a2a] text-[#e2e2e2] text-xs rounded font-mono">{s.keys}</kbd>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-5 w-full py-2 bg-[#2a2a2a] text-[#888] text-sm rounded hover:bg-[#333] transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}
