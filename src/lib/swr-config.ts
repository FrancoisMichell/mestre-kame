import type { Cache } from "swr";

// Cache LRU (Least Recently Used) personalizado com limite de entradas
export class LRUCache implements Cache {
  private cache: Map<string, unknown>;
  private maxSize: number;

  constructor(maxSize = 20) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key: string) {
    if (!this.cache.has(key)) return undefined;

    // Move para o final (mais recente)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  set(key: string, value: unknown) {
    // Remove se já existe para reordenar
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Remove o mais antigo se exceder o limite
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  delete(key: string) {
    return this.cache.delete(key);
  }

  keys(): IterableIterator<string> {
    return this.cache.keys();
  }
}
