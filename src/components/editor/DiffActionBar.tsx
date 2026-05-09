interface Props {
  keepCount: number;
  removeCount: number;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

export function DiffActionBar({ keepCount, removeCount, onAcceptAll, onRejectAll }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#161616] border-b border-[#2a2a2a] text-sm">
      <span className="text-[#888]">{keepCount} additions · {removeCount} removals</span>
      <div className="flex gap-2 ml-auto">
        <button onClick={onRejectAll} className="px-3 py-1 rounded bg-[#f8717115] text-[#f87171] hover:bg-[#f8717125] transition-colors">
          Reject All
        </button>
        <button onClick={onAcceptAll} className="px-3 py-1 rounded bg-[#4ade8015] text-[#4ade80] hover:bg-[#4ade8025] transition-colors">
          Accept All
        </button>
      </div>
    </div>
  );
}
