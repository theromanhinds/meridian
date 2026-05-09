import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useFileTree() {
  const files = useQuery(api.files.listByFolder, {});
  return {
    files: files ?? [],
    isLoading: files === undefined,
  };
}
