import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import type { SlashItem } from "./slashItems";

export interface SlashMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface Props {
  items: SlashItem[];
  command: (item: SlashItem) => void;
}

export const SlashMenu = forwardRef<SlashMenuRef, Props>(({ items, command }, ref) => {
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowDown") {
        setSelected(s => (s + 1) % Math.max(items.length, 1));
        return true;
      }
      if (event.key === "ArrowUp") {
        setSelected(s => (s - 1 + items.length) % Math.max(items.length, 1));
        return true;
      }
      if (event.key === "Enter") {
        const item = items[selected];
        if (item) command(item);
        return true;
      }
      return false;
    },
  }), [items, selected, command]);

  const grouped = useMemo(() => {
    const map = new Map<string, { item: SlashItem; index: number }[]>();
    items.forEach((item, index) => {
      const arr = map.get(item.group) ?? [];
      arr.push({ item, index });
      map.set(item.group, arr);
    });
    return Array.from(map.entries());
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="glass-strong rounded-xl shadow-pop p-3 w-[280px] animate-fade-up">
        <p className="text-sm text-ink-3 text-center py-2">No matching commands</p>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-xl shadow-pop p-1 w-[300px] max-h-[360px] overflow-y-auto animate-fade-up">
      {grouped.map(([group, entries]) => (
        <div key={group} className="py-1">
          <div className="px-2 py-1 label-mute text-[10px]">{group}</div>
          {entries.map(({ item, index }) => (
            <button
              key={index}
              onMouseDown={e => { e.preventDefault(); command(item); }}
              onMouseEnter={() => setSelected(index)}
              className={`flex items-center gap-3 w-full px-2 py-1.5 rounded-lg text-left transition-colors duration-instant ${
                index === selected ? "bg-layer-3" : ""
              }`}
            >
              <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md bg-layer-2 text-ink-2">
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink-1 font-medium leading-tight">{item.title}</div>
                {item.description && (
                  <div className="text-2xs text-ink-4 mt-0.5 truncate">{item.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
});

SlashMenu.displayName = "SlashMenu";
