import { useEffect, useState, useCallback, useRef } from "react";

const COLD_START_THRESHOLD = 10 * 60 * 1000; // 10 minutes
const LAST_ACTIVE_KEY = "lockit_last_active";

export function useAppLaunchAnimation() {
  const [isColdStart, setIsColdStart] = useState(true);
  const [showFullSplash, setShowFullSplash] = useState(false);
  const [showQuickSplash, setShowQuickSplash] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    const now = Date.now();

    if (!lastActive) {
      // First ever launch
      setIsColdStart(true);
      setShowFullSplash(true);
    } else {
      const elapsed = now - parseInt(lastActive, 10);
      if (elapsed > COLD_START_THRESHOLD) {
        // Cold start - show full splash
        setIsColdStart(true);
        setShowFullSplash(true);
      } else {
        // Warm return - show quick splash
        setIsColdStart(false);
        setShowQuickSplash(true);
      }
    }

    // Update last active on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also set on unload
    const handleBeforeUnload = () => {
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const completeSplash = useCallback(() => {
    setShowFullSplash(false);
    setShowQuickSplash(false);
    setSplashComplete(true);
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  }, []);

  return {
    isColdStart,
    showFullSplash,
    showQuickSplash,
    splashComplete,
    completeSplash,
  };
}
