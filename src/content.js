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

    // Send message to background.js in order to set/update debug mode.
    this.browser.runtime.sendMessage({
      key: 'e107-dev',
      url: window.location.href
    });
  }

}

// Run content script.
const content = new Content();
content.init();
