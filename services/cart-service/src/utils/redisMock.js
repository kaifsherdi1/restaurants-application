class RedisMock {
  constructor() {
    this.store = new Map();
  }
  async get(key) {
    return this.store.get(key) || null;
  }
  async setex(key, ttl, value) {
    this.store.set(key, value);
    return 'OK';
  }
  async del(key) {
    this.store.delete(key);
    return 1;
  }
  async ping() {
    return 'PONG';
  }
  on(event, handler) {
    // Suppress events silently
  }
}

module.exports = RedisMock;
