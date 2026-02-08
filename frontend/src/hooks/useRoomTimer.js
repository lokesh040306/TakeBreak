// src/hooks/useRoomTimer.js
import { useEffect, useState } from "react";

/**
 * Calculates remaining time for a room (in ms)
 */
const useRoomTimer = (expiresAt) => {
  const getRemaining = () => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return diff > 0 ? diff : 0;
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(0);
      return;
    }

    const expiryTime = new Date(expiresAt).getTime();
    if (Number.isNaN(expiryTime)) {
      setRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const diff = expiryTime - Date.now();

      if (diff <= 0) {
        setRemaining(0);
        clearInterval(interval); // ✅ stop ticking after expiry
      } else {
        setRemaining(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return remaining;
};

export default useRoomTimer;
