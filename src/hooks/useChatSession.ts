import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { getGenerativeModel } from "firebase/ai";
import { firebaseAI, AI_PROVIDERS } from "../lib/firebase";
import { api } from "../../convex/_generated/api";
import { hasDiffContent } from "../lib/diff";

export type AgentType = "roman_ii" | "learning" | "direct";

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string;

export function useChatSession(fileSlug: string | null) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [pendingDiff, setPendingDiff] = useState<string | null>(null);

  const file = useQuery(api.files.getBySlug, fileSlug ? { slug: fileSlug } : "skip");
  const fileId = (file as any)?._id ?? null;

  const session = useQuery(
    api.chat.getByFile,
    fileId ? { fileId } : "skip"
  );
  const addMessage = useMutation(api.chat.addMessage);

  const messages = session?.messages ?? [];

  const sendMessage = useCallback(async (text: string, agent: AgentType) => {
    if (!fileId || !file) return;
    setIsStreaming(true);
    setStreamingContent("");
    setPendingDiff(null);

    await addMessage({ fileId, role: "user", content: text, agentUsed: agent });

    const history = [...messages, { role: "user", content: text, timestamp: Date.now() }]
      .map(m => ({ role: (m.role === "assistant" ? "model" : "user") as "user" | "model", parts: [{ text: m.content }] }));

    try {
      // Firebase Gemini (primary, free)
      if (agent === "direct" || !AI_PROVIDERS.roman_ii.available) {
        const model = getGenerativeModel(firebaseAI, {
          model: "gemini-2.0-flash",
          systemInstruction: buildSystemPrompt((file as any).content ?? ""),
        });

        const chat = model.startChat({ history: history.slice(0, -1) });
        const result = await chat.sendMessageStream(text);

        let full = "";
        for await (const chunk of result.stream) {
          const piece = chunk.text();
          full += piece;
          setStreamingContent(full);
        }

        if (hasDiffContent(full)) setPendingDiff(full);
        await addMessage({ fileId, role: "assistant", content: full, agentUsed: "gemini" });
        setStreamingContent("");
      } else {
        // Server-side providers (Roman II, Anthropic) via Convex HTTP Action
        const convexSiteUrl = CONVEX_URL.replace(".convex.cloud", ".convex.site");
        const response = await fetch(`${convexSiteUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history,
            fileContent: (file as any).content,
            fileId,
            provider: agent === "roman_ii" ? "roman_ii" : "anthropic",
          }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let full = "";
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const piece = decoder.decode(value, { stream: true });
            full += piece;
            setStreamingContent(full);
          }
        }
        if (hasDiffContent(full)) setPendingDiff(full);
        await addMessage({ fileId, role: "assistant", content: full, agentUsed: agent });
        setStreamingContent("");
      }
    } catch (err) {
      console.error("Chat error:", err);
      await addMessage({ fileId, role: "assistant", content: "Sorry, something went wrong. Please try again.", agentUsed: agent });
      setStreamingContent("");
    } finally {
      setIsStreaming(false);
    }
  }, [fileId, file, messages, addMessage]);

  return { messages, isStreaming, streamingContent, pendingDiff, setPendingDiff, sendMessage };
}

function buildSystemPrompt(fileContent: string): string {
  return `You are Roman II, an AI orchestrator embedded in Meridian — a markdown command center for building AI agent systems.

Your role:
- Help refine raw notes into structured plans and specs
- When suggesting edits, use this DIFF FORMAT: <keep>text to add</keep> <remove>text to remove</remove>
- Be direct, dense, actionable. No filler.

CURRENT DOCUMENT:
---
${fileContent}
---`;
}
