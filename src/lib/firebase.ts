import { GoogleGenerativeAI } from "@google/generative-ai";

// Free Gemini API via Google AI Studio (generativelanguage.googleapis.com)
// Get a free API key at https://aistudio.google.com/apikey
// Set as VITE_GEMINI_API_KEY in .env.local and Netlify env vars
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string ?? "";

export const geminiClient = new GoogleGenerativeAI(GEMINI_API_KEY);

// ─── AI Provider Router ─────────────────────────────────────────────────────
// Add future providers here without touching component code.
// Swap DEFAULT_PROVIDER to change the active backend.

export type AIProvider = "firebase_gemini" | "anthropic" | "roman_ii";

export const DEFAULT_PROVIDER: AIProvider = "firebase_gemini";

export interface AIProviderConfig {
  label: string;
  available: boolean;
  /** Only needed for non-Firebase providers — set via Convex env vars */
  requiresServerKey: boolean;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  firebase_gemini: {
    label: "Gemini (Firebase)",
    available: true,
    requiresServerKey: false,
  },
  anthropic: {
    label: "Claude (Anthropic)",
    available: false, // flip to true once ANTHROPIC_API_KEY is set in Convex
    requiresServerKey: true,
  },
  roman_ii: {
    label: "Roman II (VPS)",
    available: false, // flip to true once VPS is wired
    requiresServerKey: true,
  },
};
