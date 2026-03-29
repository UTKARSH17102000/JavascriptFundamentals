/**
 * Soni Frontend — Easy — Event emitter (BookMyShow, DP World)
 * subscribe(eventName, callback) returns { remove }; emit invokes all listeners.
 */

class EventEmitter {
  constructor() {
    this._eventSubscriptions = new Map();
  }

  subscribe(eventName, callback) {
    if (typeof callback !== "function") {
      throw new TypeError("Callback should be a function");
    }
    if (!this._eventSubscriptions.has(eventName)) {
      this._eventSubscriptions.set(eventName, new Map());
    }
    const subscriptionId = Symbol();
    const subscriptions = this._eventSubscriptions.get(eventName);
    subscriptions.set(subscriptionId, callback);

    return {
      remove: () => {
        if (!subscriptions.has(subscriptionId)) {
          throw new Error("Subscription has already removed");
        }
        subscriptions.delete(subscriptionId);
      },
    };
  }

  emit(eventName, ...args) {
    const subscriptions = this._eventSubscriptions.get(eventName);
    if (!subscriptions) {
      throw new Error("No event found");
    }
    subscriptions.forEach((callback) => callback(...args));
  }
}

const emitter = new EventEmitter();
const subscription = emitter.subscribe("modify", (link) => {
  console.log(`Modified: ${link}`);
});
emitter.emit("modify", "test@gmail.com");
subscription.remove();
emitter.emit("modify", "test@gmail.com");
