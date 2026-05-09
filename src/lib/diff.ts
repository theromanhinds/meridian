export interface DiffChunk {
  id: string;
  type: "keep" | "remove" | "context";
  text: string;
}

export function parseAIDiff(aiResponse: string): DiffChunk[] {
  const chunks: DiffChunk[] = [];
  const regex = /<(keep|remove)>([\s\S]*?)<\/\1>|([^<]+)/g;
  let match;
  let i = 0;
  while ((match = regex.exec(aiResponse)) !== null) {
    if (match[1]) {
      chunks.push({ id: `chunk-${i++}`, type: match[1] as "keep" | "remove", text: match[2] });
    } else if (match[3] && match[3].trim()) {
      chunks.push({ id: `chunk-${i++}`, type: "context", text: match[3] });
    }
  }
  return chunks;
}

export function applyDiff(chunks: DiffChunk[], rejected: Set<string>): string {
  return chunks
    .filter(chunk => {
      if (chunk.type === "context") return true;
      if (chunk.type === "keep") return !rejected.has(chunk.id);
      if (chunk.type === "remove") return rejected.has(chunk.id);
      return true;
    })
    .map(c => c.text)
    .join("");
}

export function hasDiffContent(text: string): boolean {
  return /<keep>|<remove>/.test(text);
}
