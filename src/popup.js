import jQuery from 'jquery';
import Utils from './includes/helpers/Utils';
import UrlParser from './includes/helpers/UrlParser';
import ConfigHandler from './includes/handlers/ConfigHandler';
import StorageHandler from './includes/handlers/StorageHandler';
import DebugModeHandler from './includes/handlers/DebugModeHandler';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import './assets/css/popup.css';

/**
 * Class Popup.
 */
export default class Popup {

  /**
   * Constructor.
   */
  constructor() {
    this.browser = chrome || browser;
    this.storage = new StorageHandler('local');
    this.debug = new DebugModeHandler();
    this.config = new ConfigHandler();
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
    this.initSettingsForm();
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
          let domain = UrlParser.getDomainFromUrl(url);

          _this.debug.getDebugMode(domain, false, mode => {
            _this.buildDebugMenu(mode);
          });
        }
        else {
          _this.buildDebugMenu('---');
        }
      });
    });
  }

  /**
   * Builds debug menu in popup.
   *
   * @param {String} debugMode
   *   Saved debug mode for the current website, or false. If the current
   *   website is not using e107, this param is '---'.
   */
  buildDebugMenu(debugMode) {
    let _this = this;

    let $list = jQuery('#debug-modes');
    $list.html('');

    if (debugMode === '---') {
      let $markup = jQuery('<div class="empty-middle"></div>');
      $markup.text("Visit an e107-based website first...");
      $markup.appendTo($list);
      return;
    }

    _this.config.get('menuItems', {}, MenuItems => {
      let index = 0;

      for (let [mode, label] of Object.entries(MenuItems)) {
        if (label === 'separator') {
          // let $sep = jQuery('<hr/>');
          // $sep.appendTo($list);
          continue;
        }

        index++;

        let $label = jQuery('<label class="list-group-item list-group-item-action flex-column align-items-start custom-control custom-radio"></label>');
        let $input = jQuery('<input type="radio" name="debug-mode" class="custom-control-input">');
        let $indic = jQuery('<span class="custom-control-indicator"></span>');
        let $descr = jQuery('<span class="custom-control-description"></span>');

        $input.attr('id', 'debug-mode-' + index);
        $input.attr('data-mode', mode);

        if (debugMode && debugMode === mode) {
          $input.attr('checked', true);
        }

        $input.on('click', event => {
          _this.browser.tabs.query({active: true, currentWindow: true}, tabs => {
            let url = UrlParser.setDebugParam(tabs[0].url, mode);

            _this.browser.tabs.update(tabs[0].id, {
              "url": url
            });
          });
        });

        $descr.text(label);

        $input.appendTo($label);
        $indic.appendTo($label);
        $descr.appendTo($label);
        $label.appendTo($list);
      }
    });
  }

  initSettingsForm() {
    let _this = this;

    let $contextMenu = jQuery('#contextMenu');
    let $autoAdjust = jQuery('#autoAdjust');

    // Set default values on form elements.
    _this.config.getAll(config => {
      if (config['contextMenu'] === true) {
        $contextMenu.prop('checked', true);
      }

      if (config['autoAdjust'] === true) {
        $autoAdjust.prop('checked', true);
      }
    });

    $contextMenu.on('change', () => {
      let state = $contextMenu.is(':checked');
      console.log(state);
      _this.config.set('contextMenu', state);
    });

    $autoAdjust.on('change', () => {
      let state = $autoAdjust.is(':checked');
      console.log(state);
      _this.config.set('autoAdjust', state);
    });
  }

}

const popup = new Popup();
popup.init();
