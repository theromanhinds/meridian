interface FileData {
  _id: string;
  title: string;
  slug: string;
  status: string;
  wordCount: number;
  updatedAt: number;
  pinnedAt?: number;
}

interface Props {
  file: FileData;
  isActive: boolean;
  onSelect: (slug: string) => void;
}

function DocIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 1.5h4.5L9.5 3.5v6.5a1 1 0 01-1 1H3a1 1 0 01-1-1v-7.5a1 1 0 011-1z" />
    </svg>
  );
}

export function FileItem({ file, isActive, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(file.slug)}
      className={`group w-full text-left px-2 h-8 rounded-md flex items-center gap-2 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus
        ${isActive
          ? "bg-layer-3 text-ink-1"
          : "text-ink-2 hover:bg-layer-1 hover:text-ink-1"
        }`}
    >
      <span className={isActive ? "text-ink-1" : "text-ink-4 group-hover:text-ink-2"}>
        <DocIcon />
      </span>
      <span className="flex-1 text-sm truncate leading-none">{file.title}</span>
      {file.pinnedAt && (
        <span aria-label="Pinned" className="w-1 h-1 rounded-full bg-ink-3 flex-shrink-0" />
      )}
    </button>
  );
}
