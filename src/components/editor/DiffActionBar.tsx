interface Props {
  keepCount: number;
  removeCount: number;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  );
}

export function DiffActionBar({ keepCount, removeCount, onAcceptAll, onRejectAll }: Props) {
  return (
    <div className="flex items-center gap-3 px-5 h-12 border-b border-line flex-shrink-0 animate-fade-in bg-bg-canvas">
      <span className="text-2xs label-mute">Review changes</span>
      <span className="badge bg-ok-soft text-ok">+{keepCount}</span>
      <span className="badge bg-danger-soft text-danger">−{removeCount}</span>
      <div className="flex gap-1.5 ml-auto">
        <button
          onClick={onRejectAll}
          className="pill text-xs bg-danger-soft text-danger hover:bg-danger/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <XIcon />
          Reject
        </button>
        <button
          onClick={onAcceptAll}
          className="pill text-xs bg-ok-soft text-ok hover:bg-ok/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <CheckIcon />
          Accept
        </button>
      </div>
    </div>
  );
}
