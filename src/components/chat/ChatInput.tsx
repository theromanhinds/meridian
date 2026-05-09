import { useState, useRef } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  return (
    <div className="p-3 border-t border-[#2a2a2a]">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message... (Enter to send, Shift+Enter for newline)"
          disabled={disabled}
          rows={2}
          className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded px-3 py-2 text-sm text-[#e2e2e2] placeholder-[#444] focus:outline-none focus:border-[#7c6af7] resize-none disabled:opacity-50 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="px-4 py-2 bg-[#7c6af7] text-white text-sm rounded hover:bg-[#6b5ae6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end"
        >
          Send
        </button>
      </div>
    </div>
  );
}
