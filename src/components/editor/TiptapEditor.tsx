import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import { useEffect } from "react";
import { SlashCommand } from "./extensions/SlashCommand";

interface Props {
  content: string;
  onChange: (markdown: string) => void;
}

export function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { spellcheck: "false" } },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return `Heading ${node.attrs.level}`;
          return "Type '/' for commands…";
        },
        showOnlyCurrent: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight,
      Underline,
      Image,
      Markdown.configure({
        html: false,
        breaks: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      SlashCommand,
    ],
    content,
    autofocus: false,
    editorProps: {
      attributes: { spellcheck: "true" },
    },
    onUpdate: ({ editor }) => {
      const md = (editor.storage as { markdown?: { getMarkdown: () => string } }).markdown?.getMarkdown?.() ?? "";
      onChange(md);
    },
  });

  // External content sync (file switch / diff apply)
  useEffect(() => {
    if (!editor) return;
    const storage = editor.storage as { markdown?: { getMarkdown: () => string } };
    const current = storage.markdown?.getMarkdown?.() ?? "";
    if (current !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  return <EditorContent editor={editor} className="tiptap-editor h-full" />;
}
