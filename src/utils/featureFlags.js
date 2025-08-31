/**
 * Feature flag utilities for conditional rendering
 */

/**
 * Check if Cursor CLI should be hidden from the UI
 * @returns {boolean} true if Cursor should be hidden, false otherwise
 */
export const isCursorDisabled = () => {
  return import.meta.env.VITE_DISABLE_CURSOR === 'true';
};