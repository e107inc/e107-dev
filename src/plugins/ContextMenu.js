import StorageLocal from '../storage/StorageLocal';
import UrlParser from '../helpers/UrlParser';
import Utils from '../helpers/Utils';
import Config from '../config.json';

/**
 * Class ContextMenu.
 */
export default class ContextMenu {

  /**
   * Returns with menu items.
   *
   * @return {Object}
   */
  static get menuItems() {
    return Config.MenuItems;
  }

  /**
   * Constructor.
   */
  constructor() {
    this.browser = chrome || browser;
    this.storage = new StorageLocal('e107-dev');
  }

  /**
   * Initializes contextual menu.
   */
  init() {
    if (typeof this.browser === "undefined") {
      return;
    }

    // Binding this.
    let _this = this;

    this.browser.tabs.query({
      'active': true,
      'lastFocusedWindow': true
    }, function (tabs) {
      _this.currentUrl = tabs[0].url;
      _this.buildMenu();
    });
  };

  /**
   * Builds contextual menu.
   */
  buildMenu() {
    // Binding this.
    let _this = this;

    // @see https://developer.chrome.com/apps/contextMenus
    let parent = _this.browser.contextMenus.create({
      // @todo l10n.
      "title": "e107 Devel - Debug Mode"
    });

    for (let [mode, label] of Object.entries(ContextMenu.menuItems)) {
      if (label === 'separator') {
        _this.browser.contextMenus.create({
          "type": "separator",
          "parentId": parent
        });
        continue;
      }

      _this.browser.contextMenus.create({
        "title": label,
        "parentId": parent,
        "onclick": (info, tab) => {
          _this.menuItemClick(info, tab, mode);
        }
      });
    }
  }

  /**
   * Click handler for menu items.
   *
   * @param {Object} info
   *   Information about the item clicked and the context where the click
   *   happened.
   * @param {Object} tab
   *   The details of the tab where the click took place.
   *   See https://developer.chrome.com/extensions/tabs#type-Tab.
   * @param {String} mode
   *   Debug mode belongs to the clicked menu item.
   */
  menuItemClick(info, tab, mode) {
    if (tab.url) {
      let domain = UrlParser.getDomainFromUrl(tab.url);

      if (mode === '[debug=-]') {
        // Remove saved debug mode, so DebugModeHandler in content.js will not
        // redirect if debug mode is missing from the URL.
        this.storage.removeValue(domain);
      }
      else {
        // Save/update debug mode for the domain.
        this.storage.setValue(domain, mode);
      }

      // Rewrite current URL and redirect if necessary.
      this.rewriteUrl(tab, mode);
    }
  }

  /**
   * Rewrites the URL in the current tab according to the selected debug mode,
   * then redirects... if necessary.
   *
   * @param {Object} tab
   *   The details of the tab where the click took place.
   *   See https://developer.chrome.com/extensions/tabs#type-Tab.
   * @param {String} mode
   *   Debug mode belongs to the clicked menu item.
   */
  rewriteUrl(tab, mode) {
    let nfo = UrlParser.parseUrl(tab.url);
    // Assemble new URL with the selected debug mode.
    let url = nfo.protocol + '://' + nfo.domain + '/' + nfo.path + '?' + mode;

    // Process query parameters.
    if (nfo.query && nfo.query !== "") {
      let find = Object.keys(ContextMenu.menuItems);
      // Remove any kind of debug modes applied before.
      let query = Utils.arrayReplace(find, '', nfo.query);
      // Remove '?' query prefix if it exists.
      query = Utils.arrayReplace(['?'], '', query);
      // Remove '&' query separator from the beginning of the query.
      query = Utils.leftTrim(query, '&');
      // Append query to URL.
      url += (query !== "") ? '&' + query : '';
    }

    // Process URL fragment.
    if (nfo.fragment && nfo.fragment !== "") {
      // Remove '#' fragment prefix if it exists.
      let fragment = Utils.arrayReplace(['#'], '', nfo.fragment);
      // Append fragment to URL.
      url += (fragment !== "") ? '#' + fragment : '';
    }

    this.browser.tabs.update(tab.id, {
      "url": url
    });
  }

}
