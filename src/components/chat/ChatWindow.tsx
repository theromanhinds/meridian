import { useState, useRef, useEffect } from "react";
import { useChatSession } from "../../hooks/useChatSession";
import type { AgentType } from "../../hooks/useChatSession";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AgentSelector } from "./AgentSelector";
import { QuickActions } from "./QuickActions";

interface Props {
  fileSlug: string | null;
  onPendingDiff?: (diff: string) => void;
}

export function ChatWindow({ fileSlug, onPendingDiff }: Props) {
  const { messages, isStreaming, streamingContent, pendingDiff, setPendingDiff, sendMessage } =
    useChatSession(fileSlug);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("direct");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (pendingDiff) {
      onPendingDiff?.(pendingDiff);
      setPendingDiff(null);
    }
  }, [pendingDiff, onPendingDiff, setPendingDiff]);

  const handleRequestRefine = () => {
    sendMessage(
      "Refine this document into a structured spec using the diff format (<keep> and <remove> tags).",
      selectedAgent
    );
  };

  if (!fileSlug) {
    return (
      <div className="flex items-center justify-center h-full text-[#333] text-sm">
        Open a file to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2a2a]">
        <AgentSelector value={selectedAgent} onChange={setSelectedAgent} />
        <QuickActions fileSlug={fileSlug} onRequestRefine={handleRequestRefine} />
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-[#333] text-sm text-center mt-8">
            <p>Chat with {selectedAgent === "direct" ? "Gemini" : selectedAgent}</p>
            <p className="mt-1 text-xs text-[#222]">Context: current file content</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {isStreaming && streamingContent && (
          <ChatMessage
            message={{
              role: "assistant",
              content: streamingContent,
              timestamp: Date.now(),
              agentUsed: "streaming...",
            }}
          />
        )}
        {isStreaming && !streamingContent && (
          <div className="text-[#7c6af7] text-sm animate-pulse">Thinking...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={text => sendMessage(text, selectedAgent)}
        disabled={isStreaming || !fileSlug}
      />
    </div>
  );
}
