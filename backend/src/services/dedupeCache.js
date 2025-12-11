/**
 * Simple in-memory cache for deduplicating scan requests
 * Prevents rapid duplicate scans within a short time window
 */

class DedupeCache {
  constructor() {
    this.cache = new Map();
    // Clean up expired entries every 30 seconds
    setInterval(() => this.cleanup(), 30000);
  }

  /**
   * Add a key to the cache with TTL
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in milliseconds (default: 2000ms)
   */
  put(key, ttl = 2000) {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, expiresAt);
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} - True if key exists and not expired
   */
  has(key) {
    const expiresAt = this.cache.get(key);
    if (!expiresAt) return false;
    
    if (expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Generate cache key for scan operations
   * @param {string} actorId - ID of the user performing scan
   * @param {string} eventId - Student event ID being scanned
   * @param {string} action - Type of scan (hall/food)
   * @returns {string} - Cache key
   */
  generateScanKey(actorId, eventId, action) {
    return `scan:${actorId}:${eventId}:${action}`;
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, expiresAt] of this.cache.entries()) {
      if (expiresAt < now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
  }
}

// Export singleton instance
const dedupeCache = new DedupeCache();
export default dedupeCache;