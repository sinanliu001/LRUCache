/**
 * A Least Recently Used (LRU) cache with Time-to-Live (TTL) support. Items are kept in the cache until they either
 * reach their TTL or the cache reaches its size and/or item limit. When the limit is exceeded, the cache evicts the
 * item that was least recently accessed (based on the timestamp of access). Items are also automatically evicted if they
 * are expired, as determined by the TTL.
 * An item is considered accessed, and its last accessed timestamp is updated, whenever `has`, `get`, or `set` is called with its key.
 *
 * Implement the LRU cache provider here and use the lru-cache.test.ts to check your implementation.
 * You're encouraged to add additional functions that make working with the cache easier for consumers.
 */

import { clear } from "console"

type LRUCacheProviderOptions = {
  ttl: number // Time to live in milliseconds
  itemLimit: number
}
type LRUCacheProvider<T> = {
  has: (key: string) => boolean
  get: (key: string) => T | undefined
  set: (key: string, value: T) => void
}

// TODO: Implement LRU cache provider
export function createLRUCacheProvider<T>({
  ttl,
  itemLimit,
}: LRUCacheProviderOptions): LRUCacheProvider<T> {
  const cache = new Map<string, T>();
  const timers = new Map<string, NodeJS.Timeout>();

  return {
    has: (key: string) => {
      if (!cache.has(key)) {
        return false;
      }
      clearTimeout(timers.get(key));
      timers.delete(key);
      const timer = setTimeout(() => {
        cache.delete(key);
        timers.delete(key);
      }, ttl);
      timers.set(key, timer);
      return true;
    },
    get: (key: string) => {
      if (!cache.has(key)) {
        return undefined;
      }
      clearTimeout(timers.get(key));
      timers.delete(key);
      const timer = setTimeout(() => {
        cache.delete(key);
        timers.delete(key);
      }, ttl);
      timers.set(key, timer);
      return cache.get(key);
    },
    set: (key: string, value: T) => {
      if (cache.size >= itemLimit) {
        const oldestKey = timers.keys().next().value || "";
        clearTimeout(timers.get(oldestKey));
        cache.delete(oldestKey);
        timers.delete(oldestKey);
      }

      if (timers.has(key)) {
        clearTimeout(timers.get(key));
      }

      cache.set(key, value);
      const timer = setTimeout(() => {
        cache.delete(key);
        timers.delete(key);
      }, ttl);
      timers.set(key, timer);
    },
  }
}
