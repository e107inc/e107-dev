// Import default config files.
import StorageConfig from '../../config/storage.json';
import MenuItems from '../../config/menu.items.json';

import StorageHandler from './StorageHandler';

/**
 * Class AppBase
 */
export default class ConfigHandler {

  /**
   * Constructor.
   */
  constructor() {
    this.config = {};

    this.storageSync = new StorageHandler('sync');
  }

  /**
   * Gets the full configuration object.
   */
  getAll(callback) {
    let _this = this;

    // Set defaults.
    _this.config['menuItems'] = MenuItems;
    _this.config['storageType'] = StorageConfig.default;
    _this.config['contextMenu'] = true;
    _this.config['autoAdjust'] = true;

    _this.storageSync.get('settings', false, result => {
      if (typeof result !== false) {
        let config = JSON.parse(result);

        for (let [key, value] of Object.entries(config)) {
          _this.config[key] = value;
        }

        if (typeof callback === 'function') {
          callback(_this.config);
        }
      }
    });
  }

  /**
   * Gets one configuration item.
   *
   * @param {String} key
   *   Key for configuration item.
   * @param {String|Boolean|Number|Object|Array|Null} def
   *   Default value if no result...
   * @param {Function} callback
   *   Callback function.
   */
  get(key, def, callback) {
    let _this = this;

    _this.getAll(result => {
      if (typeof callback === 'function') {
        callback(result[key] || def);
      }
    });
  }

  set(key, val) {
    let _this = this;

    _this.getAll(result => {
      result[key] = val;

      _this.storageSync.set('settings', JSON.stringify(result));
    });
  }

}
