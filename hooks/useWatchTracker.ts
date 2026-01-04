import { useEffect, useRef } from 'react';

interface TrackerProps {
  episodeId: number | undefined;
  token: string | null;
}

export const useWatchTracker = ({ episodeId, token }: TrackerProps) => {
  const bufferRef = useRef<number>(0);
  const lastTimestampRef = useRef<number | null>(null);
  const isSyncingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!episodeId || !token) return;

    const startTracking = () => {
      if (document.visibilityState === 'visible' && lastTimestampRef.current === null) {
        lastTimestampRef.current = performance.now();
      }
    };

    const stopTracking = () => {
      if (lastTimestampRef.current !== null) {
        const delta = (performance.now() - lastTimestampRef.current) / 1000;
        bufferRef.current += Math.max(0, delta);
        lastTimestampRef.current = null;
      }
    };

    const syncData = async (isClosing = false) => {
      if (lastTimestampRef.current !== null) {
        const delta = (performance.now() - lastTimestampRef.current) / 1000;
        bufferRef.current += delta;
        lastTimestampRef.current = performance.now();
      }

      const secondsToSend = Math.floor(bufferRef.current);
      if (secondsToSend < 1 && !isClosing) return;
      if (isSyncingRef.current && !isClosing) return;

      const payload = {
        episode_id: episodeId,
        progress: 0, 
        delta_time: secondsToSend,
        completed: false
      };

      bufferRef.current -= secondsToSend;

      if (isClosing) {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/external/watch-history', blob);
      } else {
        try {
          isSyncingRef.current = true;
          await fetch('/api/external/watch-history', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (e) {
          bufferRef.current += secondsToSend;
        } finally {
          isSyncingRef.current = false;
        }
      }
    };

    startTracking();

    const interval = setInterval(() => syncData(), 60000);
    const handleVisibility = () => document.visibilityState === 'visible' ? startTracking() : stopTracking();
    const handleUnload = () => syncData(true);

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      syncData();
      stopTracking();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [episodeId, token]);
};