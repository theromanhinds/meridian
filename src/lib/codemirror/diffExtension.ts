import { StateField, StateEffect, RangeSetBuilder } from "@codemirror/state";
import { EditorView, Decoration } from "@codemirror/view";

export interface DiffRange {
  from: number;
  to: number;
  type: "keep" | "remove";
  id: string;
}

export const setDiffRanges = StateEffect.define<DiffRange[]>();
export const clearDiffRanges = StateEffect.define<null>();

const keepMark = Decoration.mark({ class: "cm-diff-keep" });
const removeMark = Decoration.mark({ class: "cm-diff-remove" });

export const diffField = StateField.define({
  create() { return Decoration.none; },
  update(decorations, tr) {
    for (const effect of tr.effects) {
      if (effect.is(setDiffRanges)) {
        const builder = new RangeSetBuilder<Decoration>();
        const sorted = [...effect.value].sort((a, b) => a.from - b.from);
        for (const range of sorted) {
          const mark = range.type === "keep" ? keepMark : removeMark;
          if (range.from < range.to) builder.add(range.from, range.to, mark);
        }
        return builder.finish();
      }
      if (effect.is(clearDiffRanges)) return Decoration.none;
    }
    return decorations.map(tr.changes);
  },
  provide: f => EditorView.decorations.from(f),
});

export const diffExtension = [diffField];
