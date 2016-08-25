'use strict';

import Container from './container';


/**
 * SlickUI Plugin class
 *
 * Load this Class to hook into the Phaser
 * Plugin system. It is used as based to loading
 * textures and adding elements on root level.
 */
class SlickUI extends Phaser.Plugin {

  /**
   * Load the Theme stuff into the plugin
   *
   * Pass the path to the theme .json file
   * and the method will load everything that
   * is needed and uses the Phaser Cache system.
   *
   * @param {String} theme
   * @return void
   */
  load(theme) {
    this.container = new Container(this.game);

    let themePath = theme.replace(/\/[^\/]+$/, '/');

    this.game.load.json('slick-ui-theme', theme);
    this.game.load.resetLocked = true;
    this.game.load.start();

    let isQueued = false;
    let queueAssets = () => {
      if(!this.game.cache.checkJSONKey('slick-ui-theme') || isQueued) {
        return;
      }

      let theme = this.game.cache.getJSON('slick-ui-theme');

      Object.keys(theme.images)
        .forEach((key) => {
          this.game.load.image('slick-ui-' + key, themePath + theme.images[key]);
        }, this);

      Object.keys(theme.fonts)
        .forEach((key) => {
          this.game.load.bitmapFont(
            key,
            themePath + theme.fonts[key][0],
            themePath + theme.fonts[key][1]
          );
        }, this);

      isQueued = true;
      this.game.load.onFileComplete.remove(queueAssets);
    };

    this.game.load.onFileComplete.add(queueAssets, this);
  }

  /**
   * Add an element to the main container
   *
   * @param {Element} element
   * @return {Element
   */
  add(element) {
    return this.container.add(element);
  }
}

// export via Function overloading
SlickUI.Container = Container;

// Export to Phaser.Plugin NS System
if(Phaser && Phaser.Plugin) {
  Phaser.Plugin.SlickUI = SlickUI;
}

// CommonJS exports

export {
  SlickUI,
  Container
}