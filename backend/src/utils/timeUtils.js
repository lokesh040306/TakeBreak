// src/utils/timeUtils.js

/**
 * Calculate room expiry timestamp based on duration
 *
 * @param {number} durationInMinutes - Room lifetime in minutes
 * @returns {Date} Exact expiry timestamp
 */
export const calculateExpiryTime = (durationInMinutes) => {
  // Current timestamp
  const now = new Date();

  // Add duration (minutes → milliseconds)
  return new Date(
    now.getTime() + durationInMinutes * 60 * 1000
  );
};

/**
 * Check whether a room has expired
 *
 * @param {Date} expiresAt - Room expiry timestamp
 * @returns {boolean} true if room is expired
 */
export const isRoomExpired = (expiresAt) => {
  // Missing expiry date means expired by default
  if (!expiresAt) return true;

  // Compare current time with expiry time
  return new Date() > new Date(expiresAt);
};

/**
 * Get remaining time before room expires
 *
 * @param {Date} expiresAt - Room expiry timestamp
 * @returns {number} Remaining time in milliseconds
 */
export const getRemainingTime = (expiresAt) => {
  // Calculate remaining time
  const remaining = new Date(expiresAt) - new Date();

  // Never return negative values
  return remaining > 0 ? remaining : 0;
};
