import { useQuery, useMutation } from "convex/react";
import { useCallback, useRef } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useFile(slug: string | null) {
  const file = useQuery(api.files.getBySlug, slug ? { slug } : "skip");
  const updateContent = useMutation(api.files.updateContent);
  const updateStatus = useMutation(api.files.updateStatus);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveContent = useCallback((id: Id<"files">, content: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateContent({ id, content, lastEditedBy: "user" });
    }, 1000);
  }, [updateContent]);

  return {
    file: file ?? null,
    isLoading: file === undefined,
    saveContent,
    updateStatus,
  };
}
