import { FileTree } from "../sidebar/FileTree";

interface Props {
  activeSlug: string | null;
  onFileSelect: (slug: string) => void;
  className?: string;
}

export function Sidebar({ activeSlug, onFileSelect, className }: Props) {
  return (
    <div className={`bg-[#0d0d0d] flex flex-col overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-[#2a2a2a]">
        <span className="text-[#7c6af7] font-bold text-sm tracking-widest uppercase">Meridian</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <FileTree activeSlug={activeSlug} onFileSelect={onFileSelect} />
      </div>
    </div>
  );
}
