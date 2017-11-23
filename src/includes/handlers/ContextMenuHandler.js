import UrlParser from '../helpers/UrlParser';
import ConfigHandler from './ConfigHandler';

/**
 * Class ContextMenuHandler.
 */
export default class ContextMenuHandler {

  /**
   * Constructor.
   */
  constructor() {
    this.browser = chrome || browser;
    this.config = new ConfigHandler();
  }

  /**
   * Initializes contextual menu.
   */
  init() {
    let _this = this;

    if (typeof _this.browser === "undefined") {
      return;
    }

    _this.config.getAll(config => {
      if (config['contextMenu'] === true) {
        _this.buildMenu(config['menuItems']);
      }
    });
  };

  /**
   * Builds contextual menu.
   */
  buildMenu(MenuItems) {
    // Binding this.
    let _this = this;

    // @see https://developer.chrome.com/apps/contextMenus
    let parent = _this.browser.contextMenus.create({
      // @todo l10n.
      "title": "e107 Dev - Debug Mode"
    });

    for (let [mode, label] of Object.entries(MenuItems)) {
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
          _this.menuItemClick(tab, mode);
        }
      });
    }
  }

  /**
   * Click handler for menu items.
   *
   * @param {Object} tab
   *   The details of the tab where the click took place.
   *   See https://developer.chrome.com/extensions/tabs#type-Tab.
   * @param {String} mode
   *   Debug mode belongs to the clicked menu item.
   */
  menuItemClick(tab, mode) {
    if (tab.url) {
      let url = UrlParser.setDebugParam(tab.url, mode);
      this.browser.tabs.update(tab.id, {
        "url": url
      });
    }
  }

}
