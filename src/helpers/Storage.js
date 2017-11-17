import Symbol from 'core-js/es6/symbol';

const __ls = Symbol('localStorage');
const __store = Symbol('store');
const __window = Symbol('window');
const __name = Symbol('name');
const __isWriting = Symbol('isWriting');
const __error = Symbol('error');

function isWindowAndHasLS(window) {
  return window && window.localStorage;
}

function isValidObject(object) {
  return (
    object && typeof object === 'object' && !Array.isArray(object) && !(object instanceof Error)
  );
}

function logError(err) {
  console.error(err);
}

function error(message) {
  return new Error(message);
}

function keyIsNotAString() {
  return error('key should be a string');
}

function isKeyAString(key) {
  return typeof key === 'string';
}

export default class Store {

  /**
   * From object to string.
   *
   * @param {Object} data
   */
  static serialize(data) {
    return JSON.stringify(data);
  }

  /**
   * From string to object.
   *
   * @param {String} string
   */
  static deserialize(string) {
    return JSON.parse(string);
  }

  /**
   * Cone object.
   *
   * @param {Object} obj
   */
  static clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Constructor.
   *
   * @param {String} name
   *   Name of local storage item.
   */
  constructor(name) {
    if (!isWindowAndHasLS(window)) {
      return logError(error('window or localStorage is not defined!'));
    }

    this.version = __VERSION__;
    this[__window] = window;
    this[__name] = name;
    this[__isWriting] = false;
    this[__error] = null;
    this[__ls] = this[__window].localStorage;
    this[__store] = this.__getAndDeserialize();

    if (!isValidObject(this[__store])) {
      this[__store] = {};
      this.__serializeAndSet();

      if (this[__error]) {
        this.destructor(true);
        return this[__error];
      }
    }

    this.__changeStorageHandler = this.__changeStorageHandler.bind(this);
    this[__window].addEventListener('storage', this.__changeStorageHandler);
  }

  /**
   * Remove event listener.
   *
   * @param {Boolean} removeStorage
   *   If true, local storage item will be removed.
   */
  destructor(removeStorage) {
    this[__window].removeEventListener('storage', this.__changeStorageHandler);

    if (removeStorage) {
      this[__ls].removeItem(this[__name]);
    }

    delete this[__window];
    delete this[__name];
    delete this[__ls];
    delete this[__store];
    delete this[__isWriting];
  }

  /**
   * You can use multikey: set('boo.bar.baz', 10).
   *
   * @param {String} key
   *   Value of key which you want set.
   * @param {*} val
   *   Value, which you want set.
   */
  set(key, val) {
    if (!isKeyAString(key)) {
      return keyIsNotAString();
    }

    let store = this[__store];
    let _val = typeof val === 'object' ? Store.clone(val) : val;
    const parts = key.split('.');
    const lastKey = parts.pop();

    if (typeof val === 'function') {
      _val = val();
    }

    if (_val === undefined) {
      return this.remove(key);
    }

    parts.forEach((_key) => {
      if (!isValidObject(store[_key])) {
        store[_key] = {};
      }
      store = store[_key];
    });
    store[lastKey] = _val;

    this[__isWriting] = true;
    this.__serializeAndSet();

    if (this[__error]) {
      return this[__error];
    }

    return _val;
  }

  /**
   * You can use multikey: get('boo.bar.baz', 10).
   *
   * @param {String} key
   *   Value of key which you want get.
   * @param {*} defaultValue
   *   If key is undefined.
   */
  get(key, defaultValue) {
    if (!arguments.length) {
      return this.getAll();
    }

    if (!isKeyAString(key)) {
      return keyIsNotAString();
    }

    let store = this[__store];
    const parts = key.split('.');
    const lastKey = parts.pop();

    for (let i = 0; i < parts.length; i += 1) {
      const _key = parts[i];

      if (store.hasOwnProperty(_key) && isValidObject(store[_key])) {
        store = store[_key];
      }
      else {
        return defaultValue;
      }
    }

    store = store[lastKey];

    if (store === undefined) {
      return defaultValue;
    }

    return typeof store === 'object' ? Store.clone(store) : store;
  }

  /**
   * Return all local storage data.
   */
  getAll() {
    return Store.clone(this[__store]);
  }

  /**
   * You can use multikey: remove('boo.bar.baz').
   *
   * @param {String} key
   *   Value of key which you want remove.
   */
  remove(key) {
    if (!arguments.length) {
      return this.clear();
    }

    if (!isKeyAString(key)) {
      return keyIsNotAString();
    }

    let store = this[__store];
    const parts = key.split('.');
    const lastKey = parts.pop();

    for (let i = 0; i < parts.length; i += 1) {
      const _key = parts[i];

      if (store.hasOwnProperty(_key) && isValidObject(store[_key])) {
        store = store[_key];
      }
      else {
        return undefined;
      }
    }

    const val = store[lastKey];
    delete store[lastKey];

    this.__serializeAndSet();

    if (this[__error]) {
      return this[__error];
    }

    return val;
  }

  /**
   * Clears local storage.
   */
  clear() {
    const store = this[__store];

    this[__store] = {};
    this.__serializeAndSet();

    return store;
  }

  __getAndDeserialize() {
    try {
      return Store.deserialize(this[__ls].getItem(this[__name]));
    }
    catch (e) {
      this[__error] = error('Error when trying to get data from localStorage!');
      logError(this[__error]);
      return this[__error];
    }
  }

  __serializeAndSet() {
    try {
      this[__ls].setItem(this[__name], Store.serialize(this[__store]));
      this[__error] = null;
    }
    catch (e) {
      this[__error] = error('Error when trying to set data to localStorage!');
      logError(this[__error]);
    }
  }

  __changeStorageHandler(event) {
    if (event.key !== this[__name] || this[__isWriting]) {
      this[__isWriting] = false;
      return;
    }

    const store = this.__getAndDeserialize();

    if (!isValidObject(store)) {
      return;
    }

    this[__store] = store;
  }

}
