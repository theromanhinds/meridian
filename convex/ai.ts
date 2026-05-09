import { httpAction } from "./_generated/server";

// Convex server-side env var access
declare const process: { env: Record<string, string | undefined> };

// HTTP Action: AI provider router
// Primary: Firebase Gemini (handled client-side — this endpoint is for server-side providers)
// Future: Anthropic, Roman II VPS
export const chat = httpAction(async (_ctx, request) => {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const { messages, fileContent, fileId, provider } = await request.json();
  const systemPrompt = buildSystemPrompt(fileContent ?? "");

  // ── Roman II VPS routing ──────────────────────────────────────────────────
  if (provider === "roman_ii") {
    const vpsUrl = process.env.VPS_AGENT_URL;
    const vpsSecret = process.env.VPS_SECRET;
    if (!vpsUrl || !vpsSecret) {
      return new Response(JSON.stringify({ error: "VPS_AGENT_URL or VPS_SECRET not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    const response = await fetch(`${vpsUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${vpsSecret}`,
      },
      body: JSON.stringify({ messages, systemPrompt, fileId }),
    });
    return new Response(response.body, {
      headers: { "Content-Type": "text/event-stream", "Access-Control-Allow-Origin": "*" },
    });
  }

  // ── Anthropic Claude routing ──────────────────────────────────────────────
  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
        status: 503,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        stream: true,
        system: systemPrompt,
        messages,
      }),
    });
    return new Response(response.body, {
      headers: { "Content-Type": "text/event-stream", "Access-Control-Allow-Origin": "*" },
    });
  }

  // Firebase Gemini is handled client-side — this endpoint should not be called for it
  return new Response(JSON.stringify({ error: `Unknown provider: ${provider}` }), {
    status: 400,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
});

function buildSystemPrompt(fileContent: string): string {
  return `You are Roman II, an AI orchestrator embedded in a markdown command center called Meridian.
The operator is building an autonomous AI agent ecosystem.

Your role:
- Help refine raw notes into structured plans and specs
- When suggesting edits to the document, use the DIFF FORMAT below
- Be direct, dense, and actionable. No filler.

DIFF FORMAT for document edits:
<keep>text to add or keep</keep>
<remove>text to remove</remove>
Regular text outside these tags is commentary, not part of the document.

CURRENT DOCUMENT CONTEXT:
---
${fileContent}
---

If the user asks you to "refine this" or "make this a spec", rewrite the document 
using the diff format so they can accept/reject changes inline.`;
}
