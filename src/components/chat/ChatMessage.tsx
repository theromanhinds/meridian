interface Message {
  role: string;
  content: string;
  timestamp: number;
  agentUsed?: string;
}

interface Props {
  message: Message;
  streaming?: boolean;
}

export function ChatMessage({ message, streaming }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-up">
        <div className="max-w-[85%] rounded-xl rounded-tr-sm px-3 py-2 text-sm text-ink-1 leading-[1.55] bg-layer-3">
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div
        className={`text-sm text-ink-1 leading-[1.7] whitespace-pre-wrap break-words ${
          streaming ? "opacity-95" : ""
        }`}
      >
        {message.content}
        {streaming && (
          <span className="inline-block w-[2px] h-[1em] ml-0.5 align-middle bg-ink-1 animate-pulse-dot" />
        )}
      </div>
    </div>
  );
}
