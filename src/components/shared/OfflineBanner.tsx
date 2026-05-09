import { useState, useEffect } from "react";

function WifiOffIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M1 1l14 14M8 13v.5" />
      <path d="M3.5 6.5C4.8 5.3 6.3 4.5 8 4.5c.6 0 1.2.1 1.7.3" />
      <path d="M5.5 9.5c.7-.7 1.5-1 2.5-1s1.8.3 2.5 1" />
    </svg>
  );
}

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on  = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online",  on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 px-4 h-7 text-xs text-warn flex-shrink-0 bg-warn-soft border-b border-line animate-fade-in"
    >
      <WifiOffIcon />
      <span>Offline — changes are queued.</span>
    </div>
  );
}
