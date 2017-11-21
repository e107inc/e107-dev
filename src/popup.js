import jQuery from 'jquery';
import Utils from './includes/helpers/Utils';
import UrlParser from './includes/helpers/UrlParser';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import './assets/css/popup.css';

import MenuItems from './config/menu.items.json';

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
    if (typeof this.browser === "undefined" || typeof this.browser.tabs === "undefined") {
      this.buildDebugMenu('---');
      return;
    }

    this.initDebugMenu();
  }

  /**
   * Init Debug mode menu.
   */
  initDebugMenu() {
    let _this = this;

    _this.browser.tabs.query({active: true, currentWindow: true}, tabs => {
      let url = tabs[0].url;

      _this.browser.cookies.getAll({"url": url}, cookies => {
        let isE107 = Utils.isE107(cookies);

        if (isE107) {
          let debugMode = UrlParser.getDebugParam(url, false);
          _this.buildDebugMenu(debugMode);
        }
        else {
          _this.buildDebugMenu('---');
        }
      });
    });
  }

  buildDebugMenu(debugMode) {
    let _this = this;

    let $list = jQuery('#debug-modes');
    $list.html('');

    if (debugMode === '---') {
      let $markup = jQuery('<div class="empty-middle"></div>');
      $markup.text("This website doesn't use e107...");
      $markup.appendTo($list);
      return;
    }

    let index = 0;
    for (let [mode, label] of Object.entries(MenuItems)) {
      if (label === 'separator') {
        let $sep = jQuery('<hr/>');
        $sep.appendTo($list);
        continue;
      }

      index++;

      let $label = jQuery('<label class="custom-control custom-radio"></label>');
      let $input = jQuery('<input type="radio" name="debug-mode" class="custom-control-input">');
      let $indic = jQuery('<span class="custom-control-indicator"></span>');
      let $descr = jQuery('<span class="custom-control-description"></span>');

      $input.attr('id', 'debug-mode-' + index);
      $input.attr('data-mode', mode);

      if (debugMode && debugMode === mode) {
        $input.attr('checked', true);
      }

      $descr.text(label);

      $input.appendTo($label);
      $indic.appendTo($label);
      $descr.appendTo($label);
      $label.appendTo($list);
    }
  }

}

const popup = new Popup();
popup.init();
