import StorageLocal from '../storage/StorageLocal';
import UrlParser from '../helpers/UrlParser';

/**
 * Class DebugModeSetter.
 */
export default class DebugModeSetter {

  /**
   * Constructor.
   */
  constructor() {
    this.browser = chrome || browser;
    this.storage = new StorageLocal('e107-dev');
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
      let url = request.url;
      let tab = sender.tab;

      let domain = UrlParser.getDomainFromUrl(url);
      let debugMode = UrlParser.getDebugParam(url, false);

      console.log("Domain: " + domain);

      _this.storage.getValue(domain, false, mode => {
        // If URL does not contain debug mode, but we have stored value.
        if (!debugMode && mode !== false && mode !== '[debug=-]' && mode !== '') {
          console.log("URL does not contain debug mode, but we have stored value.");
          _this.rewriteUrl(tab, mode);
          return;
        }

        // If URL contains debug mode, but it's not the same as the stored value.
        if (debugMode !== false && debugMode !== mode && debugMode !== '') {
          console.log("URL contains debug mode, but it's not the same as the stored value.");
          console.log("New debug mode: " + debugMode);

          if (debugMode === '[debug=-]') {
            _this.storage.removeValue(domain);
          }
          else {
            _this.storage.setValue(domain, mode);
          }

          return;
        }

        console.log("URL does not contain debug mode, and no stored value.");
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
    console.log("New URL: " + url);
    this.browser.tabs.update(tab.id, {
      "url": url
    });
  }

}
