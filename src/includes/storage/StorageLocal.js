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
  }

  /**
   * @param key
   * @param value
   * @param callback
   */
  set(key, value, callback) {
    let _this = this;

    let data = {
      [key]: value
    };

    _this.browser.storage.local.set(data, result => {
      if (typeof callback === "function") {
        callback(result);
      }
    });
  }

  /**
   * @param key
   * @param def
   * @param callback
   */
  get(key, def, callback) {
    let _this = this;

    _this.browser.storage.local.get(key, result => {
      let value = result[key] || def;

      if (typeof callback === "function") {
        callback(value);
      }
    });
  }

  /**
   * @param key
   * @param callback
   */
  remove(key, callback) {
    let _this = this;

    _this.browser.storage.local.remove(key, result => {
      if (typeof callback === "function") {
        callback(result);
      }
    });
  }

}
