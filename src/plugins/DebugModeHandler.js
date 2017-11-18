import Storage from '../storage/Storage';
import UrlParser from '../helpers/UrlParser';

/**
 * Class DebugModeHandler.
 */
export default class DebugModeHandler {

  /**
   * Constructor.
   */
  constructor() {
    this.browser = chrome || browser;
    this.storage = new Storage();
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

    _this.browser.runtime.onMessage.addListener(function (request, sender) {
      if (!request.hasOwnProperty('key') || request.key !== 'e107-dev') {
        return;
      }

      let url = request.url;
      let tab = sender.tab;

      let domain = UrlParser.getDomainFromUrl(url);
      let debugMode = UrlParser.getDebugParam(url, false);

      // console.log("From URL: " + debugMode);

      _this.storage.get(domain, false, mode => {
        // console.log("From storage: " + mode);

        // If URL contains debug mode.
        if (debugMode !== false && debugMode !== '') {
          // console.log("URL contains debug mode, save it...");

          if (debugMode === '[debug=-]') {
            _this.storage.remove(domain);
          }
          else {
            _this.storage.set(domain, debugMode, result => {
              // console.log(result);
            });
          }
        }
        // If URL does not contain debug mode.
        else {
          // If we have stored debug mode.
          if (mode !== false && mode !== '') {
            // console.log("URL does not contain debug mode, but we have stored value.");
            _this.rewriteUrl(tab, mode);
          }
          else {
            // console.log("URL does not contain debug mode, and no stored value.");
          }
        }
      });
    });
  }

  /**
   * Rewrites the URL according to the selected debug mode, then redirects...
   * if necessary.
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

}
