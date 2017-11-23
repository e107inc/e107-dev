// import StorageConfig from '../../config/storage.json';
import StorageLocal from './storage/StorageLocal';
import StorageSync from './storage/StorageSync';

/**
 * Class StorageHandler.
 *
 * To store data for this extension, we can use either "sync" or "local".
 * When using "sync", the stored data will automatically be synced to any
 * Chrome/Firefox/etc browser that the user is logged into, provided the user
 * has sync enabled.
 *
 * @see config.json
 */
export default class StorageHandler {

  /**
   * Constructor.
   */
  constructor(storageType) {
    // let storageType = StorageConfig.default;

    switch (storageType) {
      case 'sync':
        return new StorageSync();
        break;

      case 'local':
      default:
        return new StorageLocal();
        break;
    }
  }

}
