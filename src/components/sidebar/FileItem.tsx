import { StatusPill } from "../shared/StatusPill";

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

export function FileItem({ file, isActive, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(file.slug)}
      className={`w-full text-left px-3 py-2 rounded transition-colors group flex flex-col gap-0.5
        ${isActive ? "bg-[#7c6af720] border-l-2 border-[#7c6af7]" : "hover:bg-[#161616]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm truncate ${isActive ? "text-[#e2e2e2]" : "text-[#ccc]"}`}>
          {file.pinnedAt && <span className="mr-1 text-[#7c6af7]">📌</span>}
          {file.title}
        </span>
        <StatusPill status={file.status} />
      </div>
      <span className="text-xs text-[#555]">{file.wordCount} words</span>
    </button>
  );
}
