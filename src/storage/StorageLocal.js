/**
 * Class StorageLocal.
 *
 * Wrapper class for storage.local API.
 *
 * @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/local
 * @see https://developer.chrome.com/extensions/storage#property-local
 */
export default class StorageLocal {

  /**
   * Constructor.
   */
  constructor(id) {
    this.browser = chrome || browser;
    this.id = id || 'e107-dev';
  }

  /**
   * @param key
   * @param value
   */
  setValue(key, value) {
    let _this = this;

    _this.getValueAll(result => {
      result[key] = value;

      let data = {};
      data[_this.id] = result;

      _this.browser.storage.local.set(data);
    });
  }

  /**
   * @param key
   * @param def
   * @param callback
   */
  getValue(key, def, callback) {
    let _this = this;

    _this.browser.storage.local.get(_this.id, result => {
      if (typeof callback === "function") {
        callback((result[key] || def));
      }
    });
  }

  /**
   * @param callback
   */
  getValueAll(callback) {
    let _this = this;

    _this.browser.storage.local.get(_this.id, result => {
      if (typeof callback === "function") {
        callback(result);
      }
    });
  }

  /**
   * @param key
   */
  removeValue(key) {
    let _this = this;

    _this.getValueAll(result => {
      for (let [_key, _value] of Object.entries(result)) {
        if (_key === key) {
          delete result[key];
        }
      }

      let data = {};
      data[_this.id] = result;

      _this.browser.storage.local.set(data);
    })
  }

}
