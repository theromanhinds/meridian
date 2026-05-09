const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[#2a2a2a] text-[#888]",
  refining: "bg-[#7c6af720] text-[#7c6af7]",
  spec_ready: "bg-[#4ade8020] text-[#4ade80]",
  in_build: "bg-[#fbbf2420] text-[#fbbf24]",
  complete: "bg-[#4ade8040] text-[#4ade80]",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
      {status.replace("_", " ")}
    </span>
  );
}
