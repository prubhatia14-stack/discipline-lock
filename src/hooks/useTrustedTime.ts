import { useState, useEffect, useCallback } from 'react';

const TIME_OFFSET_KEY = 'lockit_time_offset';
const LAST_SYNC_KEY = 'lockit_last_time_sync';
const SYNC_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

// Endpoints to fetch trusted time (using HTTP Date header)
const TIME_ENDPOINTS = [
  'https://worldtimeapi.org/api/ip',
  'https://www.google.com',
];

async function fetchServerTime(): Promise<number | null> {
  // Try worldtimeapi first for accurate time
  try {
    const response = await fetch('https://worldtimeapi.org/api/ip', {
      method: 'GET',
      cache: 'no-store',
    });
    if (response.ok) {
      const data = await response.json();
      return data.unixtime * 1000; // Convert to milliseconds
    }
  } catch (e) {
    console.warn('worldtimeapi failed, trying fallback');
  }

  // Fallback: use HTTP Date header from any request
  for (const endpoint of TIME_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'HEAD',
        mode: 'cors',
        cache: 'no-store',
      });
      const dateHeader = response.headers.get('Date');
      if (dateHeader) {
        return new Date(dateHeader).getTime();
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

export function useTrustedTime() {
  const [timeOffset, setTimeOffset] = useState<number>(() => {
    const saved = localStorage.getItem(TIME_OFFSET_KEY);
    return saved ? parseFloat(saved) : 0;
  });
  const [isSync, setIsSync] = useState(false);

  const syncTime = useCallback(async () => {
    setIsSync(true);
    try {
      const localBefore = Date.now();
      const serverTime = await fetchServerTime();
      const localAfter = Date.now();

      if (serverTime) {
        // Account for network latency by using midpoint
        const localMid = (localBefore + localAfter) / 2;
        const offset = serverTime - localMid;
        
        setTimeOffset(offset);
        localStorage.setItem(TIME_OFFSET_KEY, offset.toString());
        localStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
      }
    } catch (e) {
      console.error('Failed to sync time:', e);
    }
    setIsSync(false);
  }, []);

  // Sync on mount and periodically
  useEffect(() => {
    const lastSync = localStorage.getItem(LAST_SYNC_KEY);
    const shouldSync = !lastSync || Date.now() - parseFloat(lastSync) > SYNC_INTERVAL;

    if (shouldSync) {
      syncTime();
    }

    // Set up periodic sync
    const interval = setInterval(syncTime, SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [syncTime]);

  const getTrustedNow = useCallback((): number => {
    return Date.now() + timeOffset;
  }, [timeOffset]);

  const getTrustedDate = useCallback((): Date => {
    return new Date(getTrustedNow());
  }, [getTrustedNow]);

  const getDayKey = useCallback((timestamp?: number): string => {
    const date = new Date(timestamp ?? getTrustedNow());
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }, [getTrustedNow]);

  const getEndOfDay = useCallback((date?: Date): Date => {
    const d = date ?? getTrustedDate();
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [getTrustedDate]);

  const getTimeLeftToday = useCallback((): number => {
    const now = getTrustedNow();
    const endOfDay = getEndOfDay().getTime();
    return Math.max(0, endOfDay - now);
  }, [getTrustedNow, getEndOfDay]);

  return {
    getTrustedNow,
    getTrustedDate,
    getDayKey,
    getEndOfDay,
    getTimeLeftToday,
    syncTime,
    isSync,
    timeOffset,
  };
}

// Standalone function for use outside React components
export function getTrustedNowStandalone(): number {
  const offset = parseFloat(localStorage.getItem(TIME_OFFSET_KEY) || '0');
  return Date.now() + offset;
}

export function getDayKeyStandalone(timestamp?: number): string {
  const date = new Date(timestamp ?? getTrustedNowStandalone());
  return date.toISOString().split('T')[0];
}
