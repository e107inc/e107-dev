import ContextMenuHandler from './includes/handlers/ContextMenuHandler';
import DebugModeHandler from './includes/handlers/DebugModeHandler';

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
    this.contextMenu = new ContextMenuHandler();
    this.contextMenu.init();

    // Apply stored debug mode on the current URL, if there is.
    this.debugModeHandler = new DebugModeHandler();
    this.debugModeHandler.init();
  }

}

// Run background script.
const background = new Background();
background.init();
