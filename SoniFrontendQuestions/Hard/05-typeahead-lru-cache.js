/**
 * Soni Frontend — Hard — Typeahead with LRU cache (Salesforce, Powerplay)
 */

class LRUCache {
  constructor(capacity) {
    this.cache = new Map();
    this.capacity = capacity;
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}

class TypeAheadCache {
  constructor(capacity) {
    this.cache = new LRUCache(capacity);
  }

  async fetchSuggestions(query) {
    const cachedResult = this.cache.get(query);
    if (cachedResult !== -1) {
      console.log("Cache hit for:", query);
      console.log([...this.cache.cache.keys()]);
      console.log("-------------------------------");
      return cachedResult;
    }
    console.log("Fetching from API for:", query);
    const results = await this.getSuggestionsFromAPI(query);
    this.cache.put(query, results);
    console.log([...this.cache.cache.keys()]);
    console.log("-------------------------------");
    return results;
  }

  async getSuggestionsFromAPI(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(query);
      }, 500);
    });
  }
}

async function testTypeAhead() {
  const typeAhead = new TypeAheadCache(2);
  await typeAhead.fetchSuggestions("apple");
  await typeAhead.fetchSuggestions("banana");
  await typeAhead.fetchSuggestions("apple");
  await typeAhead.fetchSuggestions("cherry");
  await typeAhead.fetchSuggestions("banana");
  await typeAhead.fetchSuggestions("date");
  await typeAhead.fetchSuggestions("apple");
  await typeAhead.fetchSuggestions("date");
}

testTypeAhead();
