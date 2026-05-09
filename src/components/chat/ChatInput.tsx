import { useState, useRef, useEffect } from "react";

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 8H3M8 3l5.5 5L8 13" />
    </svg>
  );
}

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  const canSend = !disabled && !!text.trim();

  return (
    <div className="px-3 pb-3 pt-2 flex-shrink-0 safe-bottom">
      <div className="bg-layer-2 rounded-xl transition-colors duration-fast focus-within:bg-layer-3">
        <div className="flex items-end gap-1.5 px-2 py-1.5">
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
            placeholder="Ask anything…"
            disabled={disabled}
            rows={1}
            className="flex-1 input-bare px-2 py-2 text-sm resize-none disabled:opacity-40 leading-[1.55] max-h-[200px] min-h-[24px]"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            title="Send (Enter)"
            aria-label="Send message"
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed ${
              canSend ? "pill-primary" : "bg-layer-3 text-ink-4"
            }`}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
