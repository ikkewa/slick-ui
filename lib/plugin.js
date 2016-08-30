'use strict';

import Container from './container';
import DisplayObject from './elements/displayobject';
import Panel from './elements/panel';
import Button from './elements/button';
import Slider from './elements/slider';
import Text from './elements/text';
import Checkbox from './elements/checkbox';
import Key from './elements/key';
import Keyboard from './elements/keyboard';
import TextField from './elements/textfield';

// used to map typ to classes, used in create() method
const createMap = {
  panel: Panel,
  button: Button,
  displayobject: DisplayObject,
  slider: Slider,
  text: Text,
  checkbox: Checkbox,
  key: Key,
  keyboard: Keyboard,
  textfield: TextField
};

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


  /**
   * Create and return an element
   *
   * This method takes the element type as string
   * and additional parameters to create an element
   * of the given type. Valid types are:
   *  - button
   *  - panel
   *  - slider
   *  - displayobject
   *  - key
   *  - keyboard
   *  - textfield
   *  - checkbox
   *
   * All additional given parameters are passed to the
   * constructor of the element to create. There is no
   * validation of the parameter.
   *
   * With this method the need to pass in the `Phaser.Game`
   * instance to the construct is gone. So instead of using
   *    new SlickUI.Button(game, x, y, ...)
   * you can now use
   *    slickinstance.create('button', x, y, ...)
   *
   * @param {String} typ - type of element to create
   * @param {..args} args - args to construct element
   * @return {SlickUI.Element}
   */
  create(typ, ...args) {
    if(createMap.hasOwnProperty(typ)) {
      return new createMap[typ](this.game, ...args);
    }

    return false;
  }
}

// export via Function overloading
SlickUI.Container = Container;
SlickUI.DisplayObject = DisplayObject;
SlickUI.Panel = Panel;
SlickUI.Button = Button;
SlickUI.Slider = Slider;
SlickUI.Text = Text;
SlickUI.Checkbox = Checkbox;
SlickUI.Key = Key;
SlickUI.Keyboard = Keyboard;
SlickUI.TextField = TextField;

// Export to Phaser.Plugin NS System
if(Phaser && Phaser.Plugin) {
  Phaser.Plugin.SlickUI = SlickUI;
}

// CommonJS exports

export {
  SlickUI,
  Container,
  DisplayObject,
  Panel,
  Button,
  Slider,
  Text,
  Checkbox,
  Key,
  Keyboard,
  TextField
};
