import { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { createEditorExtensions } from "../../lib/codemirror/setup";
import { setDiffRanges, clearDiffRanges } from "../../lib/codemirror/diffExtension";
import type { DiffRange } from "../../lib/codemirror/diffExtension";

interface Props {
  content: string;
  onChange: (value: string) => void;
  diffRanges?: DiffRange[];
}

export function MarkdownEditor({ content, onChange, diffRanges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current) return;
    const view = new EditorView({
      state: EditorState.create({
        doc: content,
        extensions: createEditorExtensions(val => onChangeRef.current(val)),
      }),
      parent: containerRef.current,
    });
    viewRef.current = view;
    return () => { view.destroy(); viewRef.current = null; };
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync content if it changes externally (file switch)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== content) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: content },
      });
    }
  }, [content]);

  // Apply diff decorations
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (diffRanges && diffRanges.length > 0) {
      view.dispatch({ effects: setDiffRanges.of(diffRanges) });
    } else {
      view.dispatch({ effects: clearDiffRanges.of(null) });
    }
  }, [diffRanges]);

  return <div ref={containerRef} className="h-full overflow-auto" />;
}
