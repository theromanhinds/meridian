import { EditorView } from "@codemirror/view";

export const darkTheme = EditorView.theme({
  "&": {
    backgroundColor: "#0d0d0d",
    color: "#e2e2e2",
    height: "100%",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: "14px",
  },
  ".cm-content": { padding: "16px 24px", caretColor: "#7c6af7" },
  ".cm-line": { lineHeight: "1.7" },
  ".cm-cursor": { borderLeftColor: "#7c6af7" },
  ".cm-selectionBackground": { backgroundColor: "#7c6af720" },
  ".cm-gutters": { backgroundColor: "#0d0d0d", borderRight: "1px solid #2a2a2a", color: "#444" },
  ".cm-activeLineGutter": { backgroundColor: "#161616" },
  ".cm-activeLine": { backgroundColor: "#161616" },
  ".tok-heading": { color: "#7c6af7", fontWeight: "bold" },
  ".tok-strong": { color: "#e2e2e2", fontWeight: "bold" },
  ".tok-emphasis": { color: "#a0a0b0", fontStyle: "italic" },
  ".tok-link": { color: "#4ade80" },
  ".tok-monospace": { color: "#f87171", fontFamily: "monospace" },
  ".cm-diff-keep": { backgroundColor: "#4ade8020", borderLeft: "3px solid #4ade80" },
  ".cm-diff-remove": { backgroundColor: "#f8717120", borderLeft: "3px solid #f87171", textDecoration: "line-through", opacity: "0.7" },
}, { dark: true });
