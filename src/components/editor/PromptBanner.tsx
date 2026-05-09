interface Props { filename: string; }

export function PromptBanner({ filename }: Props) {
  return (
    <div className="flex items-center gap-2 px-5 h-9 border-b border-line flex-shrink-0 bg-bg-canvas">
      <span className="w-1.5 h-1.5 rounded-full bg-warn flex-shrink-0" />
      <span className="text-xs text-ink-3">Agent prompt</span>
      <span className="text-xs text-ink-4">·</span>
      <span className="text-xs text-ink-3 font-mono truncate">{filename}</span>
      <span className="ml-auto text-2xs text-ink-4 hidden sm:inline">
        Changes apply on next invocation
      </span>
    </div>
  );
}
