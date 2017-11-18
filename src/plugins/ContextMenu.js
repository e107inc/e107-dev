import UrlParser from '../helpers/UrlParser';
import Config from '../config.json';

/**
 * Class ContextMenu.
 */
export default class ContextMenu {

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

    for (let [mode, label] of Object.entries(Config.MenuItems)) {
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
      let url = UrlParser.setDebugParam(tab.url, mode);
      this.browser.tabs.update(tab.id, {
        "url": url
      });
    }
  }

}
