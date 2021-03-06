import ConfigHandler from './ConfigHandler';
import StorageHandler from './StorageHandler';
import UrlParser from '../helpers/UrlParser';
import Utils from '../helpers/Utils';

/**
 * Class DebugModeHandler.
 */
export default class DebugModeHandler {

  /**
   * Constructor.
   */
  constructor() {
    this.browser = chrome || browser;
    this.config = new ConfigHandler();
    this.storage = new StorageHandler('local');
  }

  /**
   * Init.
   */
  init() {
    if (typeof this.browser === "undefined") {
      return;
    }

    // Set up listener.
    this.initListener();
  }

  /**
   * Init listener receives requests from content.js.
   */
  initListener() {
    let _this = this;

    _this.browser.runtime.onMessage.addListener((request, sender) => {
      if (!request.hasOwnProperty('key') || request.key !== 'e107-dev') {
        return;
      }

      let url = request.url;
      let tab = sender.tab;

      // @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/cookies/getAll
      _this.browser.cookies.getAll({"url": url}, cookies => {
        let isE107 = Utils.isE107(cookies);
        let hasDebugCookie = Utils.debugModeIsOn(cookies);

        if (isE107) {
          let domain = UrlParser.getDomainFromUrl(url);
          let debugMode = UrlParser.getDebugParam(url, false);

          _this.getDebugMode(domain, false, mode => {
            // If URL contains debug mode.
            if (debugMode !== false && debugMode !== '') {
              // If debug mode is off: remove it from local storage.
              if (debugMode === '[debug=-]') {
                _this.removeDebugMode(domain);
              }
              // Update debug mode in local storage.
              else {
                _this.setDebugMode(domain, debugMode);
              }
            }
            // If URL does not contain debug mode.
            else {
              // URL does not contain debug mode, but we have stored value.
              if (mode !== false && mode !== '') {
                // Redirect only if there is no debug cookie set.
                if (!hasDebugCookie) {
                  _this.config.get('autoAdjust', false, state => {
                    if (state === true) {
                      _this.rewriteUrl(tab, mode);
                    }
                  });
                }
              }
              // URL does not contain debug mode, and no stored value.
              else {
                // Do nothing.
              }
            }
          });
        }
      });
    });
  }

  /**
   * Rewrites the URL according to the selected debug mode, then redirects...
   *
   * @param {Object} tab
   *   The details of the tab where the click took place.
   *   See https://developer.chrome.com/extensions/tabs#type-Tab.
   * @param {String} mode
   *   Debug mode belongs to the clicked menu item.
   */
  rewriteUrl(tab, mode) {
    let url = UrlParser.setDebugParam(tab.url, mode);
    this.browser.tabs.update(tab.id, {
      "url": url
    });
  }

  getDebugMode(domain, def, callback) {
    let _this = this;

    _this.storage.get('debug-modes', false, result => {
      let debugModes = {};

      if (result !== false) {
        for (let [dom, mod] of Object.entries(JSON.parse(result))) {
          debugModes[dom] = mod;
        }
      }

      if (typeof callback === "function") {
        callback(debugModes[domain] || def);
      }
    });
  }

  setDebugMode(domain, mode) {
    let _this = this;

    _this.storage.get('debug-modes', false, result => {
      let debugModes = {};

      if (result !== false) {
        for (let [dom, mod] of Object.entries(JSON.parse(result))) {
          debugModes[dom] = mod;
        }
      }

      debugModes[domain] = mode;

      _this.storage.set('debug-modes', JSON.stringify(debugModes));
    });
  }

  removeDebugMode(domain) {
    let _this = this;

    _this.storage.get('debug-modes', false, result => {
      let debugModes = {};

      if (result !== false) {
        for (let [dom, mod] of Object.entries(JSON.parse(result))) {
          if (dom !== domain) {
            debugModes[dom] = mod;
          }
        }
      }

      _this.storage.set('debug-modes', JSON.stringify(debugModes));
    });
  }

  removeDebugModeAll() {
    let _this = this;
    _this.storage.set('debug-modes', JSON.stringify({}));
  }

}
