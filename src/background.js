import ContextMenu from './includes/plugins/ContextMenu';
import DebugModeHandler from './includes/plugins/DebugModeHandler';

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
    this.debugModeHandler = new DebugModeHandler();
    this.debugModeHandler.init();
  }

}

// Run background script.
const background = new Background();
background.init();
