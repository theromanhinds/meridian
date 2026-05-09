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
      selectedAgent,
    );
  };

  if (!fileSlug) {
    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center px-4 h-12 border-b border-line flex-shrink-0">
          <span className="label-mute">Assistant</span>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-8 max-w-xs">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-layer-2 flex items-center justify-center text-ink-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <p className="text-sm text-ink-1 font-medium">Open a file to chat</p>
            <p className="text-xs text-ink-3 mt-1.5">
              The assistant works with your active document.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-3 h-12 border-b border-line flex-shrink-0 gap-2">
        <AgentSelector value={selectedAgent} onChange={setSelectedAgent} />
        <QuickActions fileSlug={fileSlug} onRequestRefine={handleRequestRefine} />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.length === 0 && (
          <div className="text-center mt-2">
            <p className="text-xs text-ink-4">
              Conversing about <span className="text-ink-3">this file</span>
            </p>
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
              agentUsed: "streaming",
            }}
            streaming
          />
        )}
        {isStreaming && !streamingContent && (
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="flex gap-1">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-ink-3 animate-pulse-dot"
                  style={{ animationDelay: `${i * 140}ms` }}
                />
              ))}
            </span>
            <span className="text-xs text-ink-4">Thinking…</span>
          </div>
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
