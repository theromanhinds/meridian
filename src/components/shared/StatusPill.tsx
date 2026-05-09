interface Config {
  label: string;
  classes: string;
  dot: string;
}

const STATUS_CONFIG: Record<string, Config> = {
  draft:      { label: "Draft",      classes: "bg-layer-2 text-ink-3", dot: "bg-ink-4" },
  refining:   { label: "Refining",   classes: "bg-layer-2 text-ink-2", dot: "bg-ink-2" },
  spec_ready: { label: "Spec ready", classes: "bg-ok-soft text-ok",     dot: "bg-ok"  },
  in_build:   { label: "In build",   classes: "bg-warn-soft text-warn", dot: "bg-warn" },
  complete:   { label: "Complete",   classes: "bg-ok-soft text-ok",     dot: "bg-ok"  },
};

interface Props {
  status: string;
  interactive?: boolean;
}

export function StatusPill({ status, interactive = false }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span
      className={`badge ${config.classes} ${
        interactive ? "hover:brightness-110 transition-[filter] duration-fast cursor-pointer" : ""
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
    </span>
  );
}
