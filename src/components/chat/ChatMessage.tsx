interface Message {
  role: string;
  content: string;
  timestamp: number;
  agentUsed?: string;
}

interface Props { message: Message; }

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed
          ${isUser
            ? "bg-[#7c6af720] text-[#e2e2e2] border border-[#7c6af730]"
            : "bg-[#161616] text-[#ccc] border border-[#2a2a2a]"
          }`}
      >
        {!isUser && message.agentUsed && (
          <div className="text-xs text-[#555] mb-1">{message.agentUsed}</div>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
