/**
 * Token utility functions for JWT token validation and management
 */

/**
 * Decode JWT token without verification (client-side only)
 */
export const decodeJWT = (token) => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
};

/**
 * Get token expiry time in milliseconds
 */
export const getTokenExpiry = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;

  return decoded.exp * 1000; // Convert to milliseconds
};

/**
 * Get time until token expires in milliseconds
 */
export const getTimeUntilExpiry = (token) => {
  const expiry = getTokenExpiry(token);
  if (!expiry) return null;

  return expiry - Date.now();
};

/**
 * Check if token will expire within specified time
 */
export const willExpireWithin = (token, timeMs) => {
  const timeUntilExpiry = getTimeUntilExpiry(token);
  if (timeUntilExpiry === null) return true;

  return timeUntilExpiry <= timeMs;
};

/**
 * Validate token structure and basic properties
 */
export const isValidToken = (token) => {
  if (!token || typeof token !== "string") return false;

  const decoded = decodeJWT(token);
  if (!decoded) return false;

  // Check required fields
  return !!(decoded.sub && decoded.iat && decoded.exp);
};

/**
 * Get user ID from token
 */
export const getUserIdFromToken = (token) => {
  const decoded = decodeJWT(token);
  return decoded?.userId || decoded?.sub || null;
};

/**
 * Get token issued time
 */
export const getTokenIssuedTime = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.iat) return null;

  return decoded.iat * 1000; // Convert to milliseconds
};
