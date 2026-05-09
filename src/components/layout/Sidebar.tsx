import { FileTree } from "../sidebar/FileTree";

interface Props {
  activeSlug: string | null;
  onFileSelect: (slug: string) => void;
  className?: string;
}

export function Sidebar({ activeSlug, onFileSelect, className }: Props) {
  return (
    <div className={`flex flex-col overflow-hidden ${className ?? ""}`}>
      <FileTree activeSlug={activeSlug} onFileSelect={onFileSelect} />
    </div>
  );
}
