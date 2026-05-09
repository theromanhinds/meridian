import { EditorView, keymap, lineNumbers, drawSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { darkTheme } from "./theme";
import { diffExtension } from "./diffExtension";

export function createEditorExtensions(onChange: (value: string) => void) {
  return [
    darkTheme,
    lineNumbers(),
    history(),
    drawSelection(),
    markdown({ base: markdownLanguage }),
    syntaxHighlighting(defaultHighlightStyle),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    EditorView.updateListener.of(update => {
      if (update.docChanged) onChange(update.state.doc.toString());
    }),
    EditorView.lineWrapping,
    ...diffExtension,
  ];
}
