import ContextMenu from './plugins/ContextMenu';
import DebugModeSetter from './plugins/DebugModeSetter';

/**
 * Class Background.
 */
export default class Background {

  /**
   * Constructor.
   */
  constructor() {

  }

  /**
   * Init.
   */
  init() {
    // @todo only call this if current website is using e107.
    this.initPlugins();
  }

  /**
   * Init plugins.
   */
  initPlugins() {
    // Build contextual menu.
    this.contextMenu = new ContextMenu();
    this.contextMenu.init();

    // Apply stored debug mode on the current URL, if there is.
    this.debugModeSetter = new DebugModeSetter();
    this.debugModeSetter.init();
  }

}

// Run background script.
const background = new Background();
background.init();
