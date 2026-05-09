import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getAI, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyBS25BDFk27NNHrMQnr_08n8jkO5j8HPl4",
  authDomain: "roman-ii.firebaseapp.com",
  projectId: "roman-ii",
  storageBucket: "roman-ii.firebasestorage.app",
  messagingSenderId: "213147251705",
  appId: "1:213147251705:web:5bbfa0e280b14f96108328",
  measurementId: "G-XZDJ0PN2G9",
};

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

// Firebase AI Logic — Gemini via Google AI backend (free, no separate API key)
// Requires AI Logic to be enabled in Firebase Console → AI Services → AI Logic
export const firebaseAI = getAI(firebaseApp, { backend: new GoogleAIBackend() });

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
