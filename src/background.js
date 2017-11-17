import Storage from './helpers/Storage';
import Utils from './helpers/Utils';

/**
 * Class ContextMenu.
 */
class ContextMenu {

  /**
   * Returns with menu items.
   *
   * @return {Object}
   */
  static get menuItems() {
    // @todo l10n.
    return {
      '[debug=-]': 'Off',
      'sep1': 'separator',
      '[debug=basic+]': 'Basic',
      '[debug=counts+]': 'Traffic Counters',
      '[debug=showsql+]': 'SQL Analysis',
      '[debug=time+]': 'Time Analysis',
      'sep2': 'separator',
      '[debug=notice+]': 'Notices (PHP)',
      '[debug=warn+]': 'Warnings (PHP)',
      '[debug=backtrace+]': 'Backtraces (PHP)',
      '[debug=deprecated+]': 'Deprecated Functions (PHP)',
      '[debug=inc+]': 'Included Files (PHP)',
      'sep3': 'separator',
      '[debug=paths+]': 'Paths + Variables',
      '[debug=bbsc+]': 'BBCodes + Shortcodes',
      '[debug=sc+]': 'Shortcode Placement',
      'sep4': 'separator',
      '[debug=sql+]': 'SQL Analysis (Detailed)',
      '[debug=everything+]': 'All Details'
    };
  }

  /**
   * Constructor.
   */
  constructor() {
    this.browser = chrome || browser;
    this.storage = new Storage('e107-dev');
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
      // @todo only build menu if current website is using e107.
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
      let domain = Utils.getDomainFromUrl(tab.url);
      // Save/update debug mode for the domain.
      this.storage.set(domain, mode);
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
    let nfo = Utils.parseUrl(tab.url);
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
      query = query.replace(/^&/, '');
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

const contextMenu = new ContextMenu();
contextMenu.init();
