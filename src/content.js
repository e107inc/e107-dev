/**
 * Class Background.
 */
export default class Content {

  /**
   * Constructor.
   */
  constructor() {
    this.browser = chrome || browser;
  }

  /**
   * Init.
   */
  init() {
    if (typeof this.browser === "undefined") {
      return;
    }

    if (Content.isE107() && !Content.debugModeIsOn()) {
      // Send message to background.js in order to set/update debug mode.
      this.browser.runtime.sendMessage({
        key: 'e107-dev',
        url: window.location.href
      });
    }
  }

  /**
   * @returns {boolean}
   */
  static isE107() {
    for (let cookie of document.cookie.split('; ')) {
      let [name, value] = cookie.split("=");
      if (name.indexOf('e107') !== -1 || value.indexOf('e107') !== -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * @returns {boolean}
   */
  static debugModeIsOn() {
    for (let cookie of document.cookie.split('; ')) {
      let [name, value] = cookie.split("=");
      if (name.indexOf('e107_debug_level') !== -1) {
        return true;
      }
    }
    return false;
  }

}

// Run content script.
const content = new Content();
content.init();
