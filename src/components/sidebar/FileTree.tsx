import { useFileTree } from "../../hooks/useFileTree";
import { FolderGroup } from "./FolderGroup";
import { SearchBar } from "./SearchBar";
import { NewFileButton } from "./NewFileButton";

const FOLDERS = [
  { id: "notes", label: "Notes", icon: "📝" },
  { id: "specs", label: "Specs", icon: "📋" },
  { id: "prompts", label: "Agent Prompts", icon: "⚡" },
  { id: "archive", label: "Archive", icon: "📦" },
];

interface Props {
  activeSlug: string | null;
  onFileSelect: (slug: string) => void;
}

export function FileTree({ activeSlug, onFileSelect }: Props) {
  const { files } = useFileTree();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-[#2a2a2a]">
        <SearchBar onSelect={onFileSelect} />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {FOLDERS.map(folder => (
          <FolderGroup
            key={folder.id}
            folder={folder}
            files={files.filter((f: any) => f.folder === folder.id)}
            activeSlug={activeSlug}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
      <div className="p-3 border-t border-[#2a2a2a]">
        <NewFileButton />
      </div>
    </div>
  );
}
