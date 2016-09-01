'use strict';

/**
 * A key on the keyboard
 */
class Key {

  /**
   * Construct a new key
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {String} font
   * @param {Number} fontSize
   * @param {String} text
   */
  constructor(game, x, y, width, height, font, fontSize, text) {
    this.game = game;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this.font = font;
    this.fontSize = fontSize;
    this.text = text;
    this._isHovered = false;

    this.group = this.game.add.group(null, 'key_' + text);
  }

  /**
   * Init the key
   */
  init() {
    let colors = this.getThemeKey('slick-ui-theme', 'text_field')
                     .kbColors.keyColors;

    let graphicsUp = this._createGraphic(
        colors.keyUpBord, colors.keyUpBg);
    let graphicsDown = this._createGraphic(
        colors.keyDownBord, colors.keyDownBg);

    let keyUp = this.game.make.sprite(
        this._x, this._y, graphicsUp.generateTexture());

    let keyDown = this.game.make.sprite(
        this._x, this._y, graphicsDown.generateTexture());

    let base = this.game.make.sprite(this._x, this._y, keyUp.texture);
    base.inputEnabled = true;
    base.input.useHandCursor = true;

    base.events.onInputDown.add(() => {
      base.loadTexture(keyDown.texture);
    });

    base.events.onInputUp.add(() => {
      base.loadTexture(keyUp.texture);

      if(!this._isHovered) {
        base.events.onInputUp.halt();
      }
    });

    base.events.onInputOver.add(() => {
      this._isHovered = true;
    });

    base.events.onInputOut.add(() => {
      this._isHovered = false;
    });

    let text = this.game.make.bitmapText(
        this._x, this._y, this.font, this.text, this.fontSize);

    text.x += (this._width / 2) - (text.width / 2);
    text.y += (this._height / 2) - (this.fontSize / 2) - 4;

    this.group.add(base);
    this.group.add(text);
    this.group.keyInstance = this;

    this.events = base.events;
  }

  /**
   * Create the basic graphic for the button
   *
   * use shadow color as border definition
   *
   * @param {Mixed} color1
   * @param {Mixed} color2
   * @return {Phaser.Graphics}
   */
  _createGraphic(color1, color2) {
    color1 = color1.replace('#', '0x');
    color2 = color2.replace('#', '0x');

    let graphic = this.game.make.graphics(0, 0);
    graphic.beginFill(color1);
    graphic.drawRoundedRect(0, 0, this._width, this._height, 5);
    graphic.beginFill(color2);
    graphic.drawRoundedRect(1, 1, this._width - 2, this._height - 2, 5);

    return graphic;
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

export default Key;
