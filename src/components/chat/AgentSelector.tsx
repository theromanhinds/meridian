import { AI_PROVIDERS } from "../../lib/firebase";
import type { AgentType } from "../../hooks/useChatSession";

interface Props {
  value: AgentType;
  onChange: (v: AgentType) => void;
}

export function AgentSelector({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as AgentType)}
      className="bg-[#0d0d0d] border border-[#2a2a2a] text-[#888] text-sm rounded px-2 py-1 focus:outline-none focus:border-[#7c6af7] transition-colors"
    >
      <option value="direct">Gemini (Firebase) ✓</option>
      <option value="roman_ii" disabled={!AI_PROVIDERS.roman_ii.available}>
        Roman II (VPS){!AI_PROVIDERS.roman_ii.available ? " — not configured" : ""}
      </option>
      <option value="learning" disabled={!AI_PROVIDERS.anthropic.available}>
        Claude (Anthropic){!AI_PROVIDERS.anthropic.available ? " — not configured" : ""}
      </option>
    </select>
  );
}
