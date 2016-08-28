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
  constructor(game, font, fontSize, initialize, layout = 'QWERTZ') {
    this.game = game;

    this.font = font;
    this.fontSize = fontSize || 16;
    this.layout = layouts[layout];
    this.height = 160;

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
    var bitmap = this.game.make.bitmapData(this.game.width, this.game.height);
    bitmap.ctx.beginPath();
    bitmap.ctx.rect(0, 0, this.game.width, this.game.height);
    bitmap.ctx.fillStyle = '#cccccc';
    bitmap.ctx.fill();
    bitmap.ctx.beginPath();
    bitmap.ctx.rect(0, 2, this.game.width, this.game.height);
    bitmap.ctx.fillStyle = '#f0f0f0';
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

    key.events.onInputUp.add(() => {
      if(key.text === 'UPPER' || key.text === 'lower') {
        this.toggleMode();
        return;
      }

      if(key.text === 'OK') {
        this.events.onOK.dispatch();
        return;
      }

      this.events.onKeyPress.dispatch(key.text);
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
}

export default Keyboard;
