import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import { filterSlashItems, type SlashItem } from "./slashItems";
import { SlashMenu, type SlashMenuRef } from "./SlashMenu";

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: false,
        allowSpaces: false,
        items: ({ query }: { query: string }) => filterSlashItems(query),
        command: ({
          editor,
          range,
          props,
        }: {
          editor: import("@tiptap/core").Editor;
          range: import("@tiptap/core").Range;
          props: SlashItem;
        }) => {
          props.command({ editor, range });
        },
        render: () => {
          let component: ReactRenderer<SlashMenuRef> | null = null;
          let popup: HTMLDivElement | null = null;

          const updatePosition = (rect: DOMRect | null | undefined) => {
            if (!popup || !rect) return;
            const pad = 6;
            const popH = popup.offsetHeight || 360;
            const popW = popup.offsetWidth || 300;
            let top = rect.bottom + pad;
            let left = rect.left;
            if (top + popH > window.innerHeight - 8) top = rect.top - popH - pad;
            if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8;
            if (left < 8) left = 8;
            popup.style.top = `${top}px`;
            popup.style.left = `${left}px`;
          };

          return {
            onStart: (props: {
              editor: import("@tiptap/core").Editor;
              clientRect?: (() => DOMRect | null) | null;
            }) => {
              component = new ReactRenderer(SlashMenu, {
                props,
                editor: props.editor,
              });
              if (!props.clientRect) return;
              popup = document.createElement("div");
              popup.style.position = "fixed";
              popup.style.zIndex = "60";
              popup.style.top = "0";
              popup.style.left = "0";
              popup.appendChild(component.element);
              document.body.appendChild(popup);
              updatePosition(props.clientRect());
            },
            onUpdate: (props: {
              clientRect?: (() => DOMRect | null) | null;
            }) => {
              component?.updateProps(props);
              updatePosition(props.clientRect?.());
            },
            onKeyDown: (props: { event: KeyboardEvent }): boolean => {
              if (props.event.key === "Escape") {
                popup?.remove();
                component?.destroy();
                popup = null;
                component = null;
                return true;
              }
              return component?.ref?.onKeyDown(props) ?? false;
            },
            onExit: () => {
              popup?.remove();
              component?.destroy();
              popup = null;
              component = null;
            },
          };
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
