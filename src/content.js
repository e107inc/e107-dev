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

    // Send message to background.js.
    this.browser.runtime.sendMessage({url: window.location.href});
  }

}

// Run content script.
const content = new Content();
content.init();
