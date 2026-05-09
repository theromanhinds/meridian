import type { Editor, Range } from "@tiptap/core";
import type { ReactNode } from "react";

export interface SlashItem {
  title: string;
  description?: string;
  group: string;
  keywords?: string[];
  icon: ReactNode;
  command: (ctx: { editor: Editor; range: Range }) => void;
}

const I = (path: ReactNode) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

export const slashItems: SlashItem[] = [
  // ── Headings ────────────────────────────────────────────────
  {
    title: "Heading 1",
    description: "Large section heading",
    group: "Basic blocks",
    keywords: ["h1", "title", "header"],
    icon: I(<><path d="M3 4v8M9 4v8M3 8h6M12 6.5v5.5M12 6.5l1.5-1" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    group: "Basic blocks",
    keywords: ["h2", "subtitle"],
    icon: I(<><path d="M3 4v8M9 4v8M3 8h6M11 7l1-1.5 1.5-.5c1 0 1.5 1 1 2l-2.5 4h2.5" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    group: "Basic blocks",
    keywords: ["h3"],
    icon: I(<><path d="M3 4v8M9 4v8M3 8h6M11 5.5l1-.5h1.5c.8 0 1.2.8.8 1.5l-1 1 1 1c.5.8 0 1.5-.8 1.5H12" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run(),
  },

  // ── Lists ───────────────────────────────────────────────────
  {
    title: "Bullet list",
    description: "Simple bulleted list",
    group: "Lists",
    keywords: ["ul", "unordered", "bullet"],
    icon: I(<><circle cx="3" cy="4" r="1" fill="currentColor" /><circle cx="3" cy="8" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><path d="M6 4h7M6 8h7M6 12h7" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    description: "Ordered list with numbers",
    group: "Lists",
    keywords: ["ol", "ordered", "numbered"],
    icon: I(<><path d="M2 3h1.5v3M2 6h2M3 7v3h-1M2 12h2v-1H2v-1h1.5M6 4h7M6 8h7M6 12h7" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Task list",
    description: "Checkable to-do list",
    group: "Lists",
    keywords: ["todo", "task", "checkbox"],
    icon: I(<><rect x="2" y="3" width="3" height="3" rx="0.5" /><path d="M2.5 4.5l1 1 1-1.5" /><rect x="2" y="10" width="3" height="3" rx="0.5" /><path d="M7 4.5h7M7 11.5h7" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },

  // ── Inline / blocks ─────────────────────────────────────────
  {
    title: "Quote",
    description: "Indent text as a quote",
    group: "Basic blocks",
    keywords: ["blockquote", "cite"],
    icon: I(<><path d="M4 5l-1 2v3h3v-3H4l1-2zM10 5l-1 2v3h3v-3h-2l1-2z" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Code block",
    description: "Multi-line code with monospace",
    group: "Basic blocks",
    keywords: ["code", "pre"],
    icon: I(<><path d="M5 5L2 8l3 3M11 5l3 3-3 3M9 4l-2 8" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Visual section break",
    group: "Basic blocks",
    keywords: ["hr", "rule", "separator"],
    icon: I(<><path d="M2 8h12" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Highlight",
    description: "Mark current selection",
    group: "Inline",
    keywords: ["mark", "yellow"],
    icon: I(<><path d="M3 11l3-3 6 6-3 3-6-6zM7 7l4-4 2 2-4 4" /></>),
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleHighlight().run(),
  },

  // ── Insert ──────────────────────────────────────────────────
  {
    title: "Link",
    description: "Insert a hyperlink",
    group: "Insert",
    keywords: ["url", "href"],
    icon: I(<><path d="M6 10l4-4M5.5 7.5L4 9a2.5 2.5 0 003.5 3.5L9 11M10.5 8.5L12 7a2.5 2.5 0 00-3.5-3.5L7 5" /></>),
    command: ({ editor, range }) => {
      const url = window.prompt("Enter URL");
      if (!url) {
        editor.chain().focus().deleteRange(range).run();
        return;
      }
      editor.chain().focus().deleteRange(range).insertContent(`[${url}](${url}) `).run();
    },
  },
  {
    title: "Image",
    description: "Embed image by URL",
    group: "Insert",
    keywords: ["img", "picture"],
    icon: I(<><rect x="2" y="3" width="12" height="10" rx="1" /><circle cx="6" cy="7" r="1" /><path d="M2 11l3-3 4 4 2-2 3 3" /></>),
    command: ({ editor, range }) => {
      const url = window.prompt("Image URL");
      if (!url) {
        editor.chain().focus().deleteRange(range).run();
        return;
      }
      editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
    },
  },

  // ── AI ──────────────────────────────────────────────────────
  {
    title: "Ask AI",
    description: "Open chat with selection",
    group: "AI",
    keywords: ["assistant", "ai", "chat"],
    icon: I(<><path d="M14 8a6 6 0 11-12 0 6 6 0 0112 0zM8 5v3l2 1.5" /></>),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.dispatchEvent(new CustomEvent("meridian:ai", { detail: { intent: "ask" } }));
    },
  },
  {
    title: "Continue writing",
    description: "Let AI extend the document",
    group: "AI",
    keywords: ["continue", "expand"],
    icon: I(<><path d="M3 4l5 4-5 4M9 8h5" /></>),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.dispatchEvent(new CustomEvent("meridian:ai", { detail: { intent: "continue" } }));
    },
  },
  {
    title: "Summarize",
    description: "Ask AI to summarize this document",
    group: "AI",
    keywords: ["tldr", "summary"],
    icon: I(<><path d="M3 4h10M3 7h10M3 10h6M3 13h8" /></>),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      window.dispatchEvent(new CustomEvent("meridian:ai", { detail: { intent: "summarize" } }));
    },
  },
];

export function filterSlashItems(query: string): SlashItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return slashItems;
  return slashItems.filter(item => {
    if (item.title.toLowerCase().includes(q)) return true;
    if (item.description?.toLowerCase().includes(q)) return true;
    if (item.keywords?.some(k => k.toLowerCase().includes(q))) return true;
    return false;
  });
}
