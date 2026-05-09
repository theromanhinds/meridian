interface Props { filename: string; }

export function PromptBanner({ filename }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#92400e20] border-b border-[#92400e50] text-sm">
      <span className="text-[#fbbf24]">⚡</span>
      <span className="text-[#fbbf24] font-medium">LIVE AGENT PROMPT</span>
      <span className="text-[#888]">—</span>
      <span className="text-[#aaa] font-mono text-xs">{filename}</span>
      <span className="text-[#666] ml-2">Changes save directly to disk and take effect on next agent invocation.</span>
    </div>
  );
}
