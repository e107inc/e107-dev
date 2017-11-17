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

    let defaultMode = '[debug=-]';

    for (let [mode, label] of Object.entries(ContextMenu.menuItems)) {
      if (label === 'separator') {
        // @fixme separator breaks default value for radios... the first radio
        // button is always checked in each group.
        // that.browser.contextMenus.create({
        //   "type": "separator",
        //   "parentId": parent
        // });
        continue;
      }

      _this.browser.contextMenus.create({
        "type": "radio",
        "title": label,
        "parentId": parent,
        "checked": mode === defaultMode,
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
    let url = tab.url;
    url = url.split("?");

    this.browser.tabs.update(tab.id, {
      "url": url[0] + '?' + mode
    });
  }

}

const contextMenu = new ContextMenu();
contextMenu.init();
