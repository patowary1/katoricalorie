/**
 * KatoriCalorie Privacy-Conscious Product Analytics Wrapper
 * Powered by Umami. Telemetry only — zero PII, zero personal health metrics.
 */

(function(window) {
  'use strict';

  // Strict list of allowed events and disallowed fields to enforce absolute privacy
  const DISALLOWED_KEYS = new Set([
    'age', 'weight', 'height', 'gender', 'sex', 'activity',
    'bmr', 'tdee', 'calories_target', 'target_calories', 'query',
    'search_query', 'searchText', 'keyword', 'name', 'email', 'user_id'
  ]);

  function sanitizeData(data) {
    if (!data || typeof data !== 'object') return {};
    const clean = {};
    for (const [k, v] of Object.entries(data)) {
      if (!DISALLOWED_KEYS.has(k.toLowerCase())) {
        clean[k] = v;
      }
    }
    return clean;
  }

  function trackKatoriEvent(eventName, eventData) {
    try {
      if (typeof window !== 'undefined' && window.umami && typeof window.umami.track === 'function') {
        const cleanPayload = sanitizeData(eventData);
        window.umami.track(eventName, cleanPayload);
      }
    } catch (err) {
      // Fail silently: analytics failure must never impact product operation
    }
  }

  // Export globally
  if (typeof window !== 'undefined') {
    window.trackKatoriEvent = trackKatoriEvent;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { trackKatoriEvent, sanitizeData };
  }
})(typeof window !== 'undefined' ? window : globalThis);
