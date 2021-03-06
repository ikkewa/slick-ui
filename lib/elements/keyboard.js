'use strict';

import Key from './key';

const layouts = {
  QWERTZ: [
    [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' , 'DEL' ],
    [ 'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', '!' ],
    [ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'UPPER' ],
    [ 'OK', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ' ' ]
  ],
  QWERTY: [
    [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' , 'DEL' ],
    [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '!' ],
    [ 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'UPPER' ],
    [ 'OK', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ' ' ]
  ]
};

const specialWidths = {
  DEL: 64,
  UPPER: 80,
  ' ': 80
};

const LAYOUT_QWERTZ = 'QWERTZ';
const LAYOUT_QWERTY = 'QWERTY';  // eslint-disable-line no-unused-vars

/**
 * Definition of the keyboard class
 */
class Keyboard {

  /**
   * Construct a new keyboard
   *
   * @param {String} font
   * @param {Number} fontSize
   * @param {Boolean} initialize
   */
  constructor(game, font, fontSize, initialize, layout = LAYOUT_QWERTZ) {
    this.game = game;

    this.font = font;
    this.fontSize = fontSize || 16;
    this.layout = layouts[layout];
    this.height = 160;
    this.keys = {};

    let colors = this.getThemeKey('slick-ui-theme', 'text_field')
                     .kbColors;

    this.bgColor = colors.bgColor;
    this.bordColor = colors.bordColor;

    this.group = this.game.add.group();
    this.group.fixedToCamera = true;

    this.keyGroupLower = this.game.make.group();
    this.keyGroupUpper = this.game.make.group();

    this.keyGroupCurrent = this.keyGroupLower;
    this.keyGroupUpper.visible = false;

    this.events = {
      onKeyPress: new Phaser.Signal(),
      onOK: new Phaser.Signal()
    };

    if(initialize !== false) {
      this.create();
    }
  }

  /**
   * Create the keyboard layout
   */
  create() {

    // create the background
    var bitmap = this.game.make.bitmapData(this.game.width, this.height);
    bitmap.ctx.beginPath();
    bitmap.ctx.rect(0, 0, this.game.width, this.height);
    bitmap.ctx.fillStyle = this.bordColor;
    bitmap.ctx.fill();
    bitmap.ctx.beginPath();
    bitmap.ctx.rect(0, 2, this.game.width, this.height);
    bitmap.ctx.fillStyle = this.bgColor;
    bitmap.ctx.fill();

    var base = this.game.make.sprite(0, 0, bitmap);
    var keyboardWidth = 440;
    var offsetX = Math.round(this.game.world.centerX - (keyboardWidth / 2));

    this.group.add(base);
    this.group.add(this.keyGroupLower);
    this.group.add(this.keyGroupUpper);


    // generate the keys
    this.layout.forEach((row, idx) => {
      offsetX = idx !== 3 ? offsetX + 16 : offsetX - 32;
      row.forEach((k, idk) => {
        let x = offsetX + (idk * 36);
        let y = 16 + (idx * 36);
        let w = specialWidths.hasOwnProperty(k) ? specialWidths[k] : 32;
        let h = 32;
        let keyLow = new Key(this.game, x, y, w, h, this.font, this.fontSize, k);

        this.addKey(keyLow, this.keyGroupLower);

        let keyUpp;
        if(k.toUpperCase().match(/[A-Z]/)) {
          keyUpp = new Key(this.game, x, y, w, h, this.font, this.fontSize, k.toUpperCase());
        } else {
          keyUpp = new Key(this.game, x, y, w, h, this.font, this.fontSize, k);
        }
        this.addKey(keyUpp, this.keyGroupUpper);
      });
    });

    this.game.input.keyboard.onPressCallback = (char) => {
      if(this.group.visible) {
        let k = 'key_' + char;

        // this should prevent, that non layout specific
        // keys are pressed and to "flash" the key
        // when pressing with keyboard
        // @TODO need timer for "flash"
        if(this.keys.hasOwnProperty(k)) {
          let key = this.keys['key_' + char];
          key.events.onInputDown.dispatch();
          this.events.onKeyPress.dispatch(key);
          key.events.onInputUp.dispatch();
        }
      }
    };
  }

  /**
   * Add a key to the keygroup
   *
   * @param {SlickUI.Key} key
   * @param {Phaser.Group} group
   */
  addKey(key, group) {
    key.init();

    if(!group) {
      group = this.keyGroupCurrent;
    }

    group.add(key.group);
    this.keys['key_' + key.text] = key;

    key.events.onInputUp.add(() => {
      if(key.text === 'UPPER' || key.text === 'lower') {
        this.toggleMode();
        return;
      }

      if(key.text === 'OK') {
        this.events.onOK.dispatch();
        return;
      }

      this.events.onKeyPress.dispatch(key);
    });
  }

  /**
   * Toggle the upper/lower state
   *
   * @return void
   */
  toggleMode() {
    this.keyGroupUpper.visible = !this.keyGroupUpper.visible;
    this.keyGroupLower.visible = !this.keyGroupLower.visible;
  }

  /**
   * Get a key from the given theme
   *
   * @param {String} key
   * @param {String} typ
   * @return {Object|false}
   */
  getThemeKey(key, typ) {
    let theme = this.game.cache.getJSON(key);

    if(!theme || !theme[typ]) {
      return false;
    }

    return theme[typ];
  }
}

export {
  Keyboard,
  LAYOUT_QWERTZ,
  LAYOUT_QWERTY
};
