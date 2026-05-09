import type { DiffChunk } from "../../lib/diff";

interface Props {
  chunks: DiffChunk[];
}

export function DiffViewer({ chunks }: Props) {
  return (
    <div className="h-full overflow-y-auto px-6 sm:px-12 py-10">
      <div className="max-w-[760px] mx-auto font-sans text-md leading-[1.7] text-ink-1 whitespace-pre-wrap">
        {chunks.map(chunk => {
          if (chunk.type === "context") {
            return <span key={chunk.id}>{chunk.text}</span>;
          }
          const cls = chunk.type === "keep" ? "diff-keep" : "diff-remove";
          return (
            <span key={chunk.id} className={cls}>
              {chunk.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}
