import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const DB_NAME = "meridian-offline";
const STORE = "pending-writes";

export async function queueOfflineWrite(fileId: string, content: string) {
  const db = await openDB();
  const tx = db.transaction(STORE, "readwrite");
  await tx.objectStore(STORE).put({ fileId, content, timestamp: Date.now() }, fileId);
}

export function useOfflineSync() {
  const updateContent = useMutation(api.files.updateContent);

  useEffect(() => {
    const flush = async () => {
      if (!navigator.onLine) return;
      const db = await openDB();
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      const all: Array<{ fileId: Id<"files">; content: string }> = await new Promise((res, rej) => { const r = store.getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
      for (const item of all) {
        try {
          await updateContent({ id: item.fileId, content: item.content });
          await store.delete(item.fileId);
        } catch (e) {
          console.error("Failed to sync:", e);
        }
      }
    };
    window.addEventListener("online", flush);
    flush();
    return () => window.removeEventListener("online", flush);
  }, [updateContent]);
}

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
