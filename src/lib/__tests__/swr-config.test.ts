import { describe, it, expect, beforeEach } from "vitest";
import { LRUCache } from "../swr-config";

describe("LRUCache", () => {
  let cache: LRUCache;

  beforeEach(() => {
    cache = new LRUCache(3); // Small cache for testing
  });

  it("should store and retrieve values", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    expect(cache.get("key1")).toBe("value1");
    expect(cache.get("key2")).toBe("value2");
  });

  it("should return undefined for non-existent keys", () => {
    expect(cache.get("nonexistent")).toBeUndefined();
  });

  it("should evict oldest entry when max size is reached", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    // Cache is full (3 entries)
    expect(cache.get("key1")).toBe("value1");
    expect(cache.get("key2")).toBe("value2");
    expect(cache.get("key3")).toBe("value3");

    // Add 4th entry - should evict key1 (oldest)
    cache.set("key4", "value4");

    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBe("value2");
    expect(cache.get("key3")).toBe("value3");
    expect(cache.get("key4")).toBe("value4");
  });

  it("should move accessed items to the end (most recent)", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    // Access key1 - moves it to the end
    cache.get("key1");

    // Add key4 - should evict key2 (now the oldest)
    cache.set("key4", "value4");

    expect(cache.get("key1")).toBe("value1"); // Still there
    expect(cache.get("key2")).toBeUndefined(); // Evicted
    expect(cache.get("key3")).toBe("value3");
    expect(cache.get("key4")).toBe("value4");
  });

  it("should delete specific keys", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");

    cache.delete("key1");

    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBe("value2");
  });

  it("should return all keys", () => {
    cache.set("key1", "value1");
    cache.set("key2", "value2");
    cache.set("key3", "value3");

    const keys = Array.from(cache.keys());

    expect(keys).toHaveLength(3);
    expect(keys).toContain("key1");
    expect(keys).toContain("key2");
    expect(keys).toContain("key3");
  });

  it("should handle updating existing keys", () => {
    cache.set("key1", "value1");
    cache.set("key1", "updated-value1");

    expect(cache.get("key1")).toBe("updated-value1");

    // Should not create duplicate entries
    const keys = Array.from(cache.keys());
    expect(keys.filter((k) => k === "key1")).toHaveLength(1);
  });

  it("should respect max size parameter", () => {
    const smallCache = new LRUCache(2);

    smallCache.set("key1", "value1");
    smallCache.set("key2", "value2");
    smallCache.set("key3", "value3");

    // Only 2 entries should be kept
    expect(Array.from(smallCache.keys())).toHaveLength(2);
    expect(smallCache.get("key1")).toBeUndefined();
  });

  it("should handle default max size", () => {
    const defaultCache = new LRUCache();

    // Should accept 20 entries (default)
    for (let i = 1; i <= 20; i++) {
      defaultCache.set(`key${i}`, `value${i}`);
    }

    expect(Array.from(defaultCache.keys())).toHaveLength(20);

    // 21st entry should evict the first
    defaultCache.set("key21", "value21");
    expect(Array.from(defaultCache.keys())).toHaveLength(20);
    expect(defaultCache.get("key1")).toBeUndefined();
    expect(defaultCache.get("key21")).toBe("value21");
  });

  describe("Memory Leak Prevention", () => {
    it("should prevent infinite cache growth", () => {
      const cache = new LRUCache(20);

      // Simulate pagination with 100 different pages
      for (let page = 1; page <= 100; page++) {
        cache.set(`/students?page=${page}&limit=12`, {
          students: [],
          meta: { page, limit: 12, total: 1000 },
        });
      }

      // Cache should never exceed max size
      expect(Array.from(cache.keys()).length).toBeLessThanOrEqual(20);

      // Only the last 20 pages should be cached
      for (let page = 81; page <= 100; page++) {
        expect(cache.get(`/students?page=${page}&limit=12`)).toBeDefined();
      }

      // Early pages should be evicted
      expect(cache.get("/students?page=1&limit=12")).toBeUndefined();
      expect(cache.get("/students?page=50&limit=12")).toBeUndefined();
    });

    it("should handle rapid sequential accesses efficiently", () => {
      const cache = new LRUCache(5);

      // Simulate rapid page changes
      const pages = [1, 2, 3, 4, 5, 1, 2, 6];

      pages.forEach((page) => {
        cache.set(`page${page}`, `data${page}`);
      });

      // Should keep most recent 5 pages
      expect(Array.from(cache.keys())).toHaveLength(5);

      // Page 1 and 2 were accessed again, so should still be there
      expect(cache.get("page1")).toBe("data1");
      expect(cache.get("page2")).toBe("data2");
      expect(cache.get("page6")).toBe("data6");

      // Page 3 should be evicted (least recently used)
      expect(cache.get("page3")).toBeUndefined();
    });
  });
});
