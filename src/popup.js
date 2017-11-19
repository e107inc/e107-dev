import jQuery from "jquery";
import Utils from './helpers/Utils';

/**
 * Class Popup.
 */
export default class Popup {

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

    this.updateSiteInfo();
  }

  /**
   * Updates '.site-info' contents.
   */
  updateSiteInfo() {
    let _this = this;

    _this.browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      let url = tabs[0].url;

      // @see https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/cookies/getAll
      _this.browser.cookies.getAll({"url": url}, cookies => {
        let $info = jQuery('.site-info');
        let $text = jQuery('<span></span>');

        if (Utils.isE107(cookies)) {
          $text.addClass('success');
          // @todo l10n.
          $text.html("This website uses e107 CMS");
        }
        else {
          $text.addClass('fail');
          // @todo l10n.
          $text.html("This website doesn't use e107 CMS");
        }

        $info.html($text);
      });
    });
  }

}

const popup = new Popup();
popup.init();
