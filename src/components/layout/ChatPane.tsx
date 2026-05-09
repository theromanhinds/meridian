import { ChatWindow } from "../chat/ChatWindow";

interface Props {
  fileSlug: string | null;
  className?: string;
  onPendingDiff?: (diff: string) => void;
}

export function ChatPane({ fileSlug, className, onPendingDiff }: Props) {
  return (
    <div className={`flex flex-col overflow-hidden ${className ?? ""}`}>
      <ChatWindow fileSlug={fileSlug} onPendingDiff={onPendingDiff} />
    </div>
  );
}
