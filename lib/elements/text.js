'use strict';

/**
 * A Text Object to display text with a bitmap font
 */
class Text {

  /**
   * Construct new Text object
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {Number} val
   * @param {Number} size
   * @param {String} font
   * @param {Number} width
   * @param {Number} height
   */
  constructor(game, x, y, val, size, font, width, height) {
    this.game = game;
    this._x = x;
    this._y = y;
    this._val = val;
    this.width = width || this.game.width;
    this.height = height || this.game.height;
    this.font = font;
    this.size = size || 16;
    this.container = null;
  }

  /**
   * Set the parent Container object
   *
   * @param {Container}
   * @return void
   */
  setContainer(container) {
    this.container = container;
  }

  /**
   * Init the object
   */
  init() {
    let theme = this.game.cache.getJSON('slick-ui-theme');
    if(!this.font) {
      let fonts = Object.keys(theme.fonts);
      this.font = fonts[fonts.length - 1];
    }

    this.reset(this._x, this._y);
  }

  /**
   * Recalc and rerender the text on the bitmapdata
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Boolean} recalcWidth
   */
  reset(x, y, recalcWidth) {
    let w = Math.min(this.container.width - x, this.width);
    let h = Math.min(this.container.height - y, this.height);

    if(this.text) {
      if(recalcWidth === false) {
        w = this.text.maxWidth;
        h = this.text.maxHeight;
      }

      this.text.destroy();
    }

    x += this.container.x;
    y += this.container.y;
    this.text = this.game.make.bitmapText(x, y, this.font, this._val, this.size);
    this.text.maxWidth = w;
    this.text.maxHeight = h;
    this.text.fixedToCamera = true;
    this.container.displayGroup.add(this.text);
  }


  /**
   * Center the text horizonzally in the container
   *
   * @return void
   */
  centerHorizontally() {
    this.text.cameraOffset.x =
      this.text.maxWidth / 2 - this.text.width / 2 + this.container.x;
    return this;
  }

  /**
   * Center the text vertically in the container
   *
   * @return void
   */
  centerVertically() {
    let theme = this.game.cache.getJSON('slick-ui-theme');
    this.text.cameraOffset.y = (
      this.container.height / 2 -
      this.text.height / 2 -
      Math.round(theme.button['border-x'] / 2) +
      this.container.y
    );

    return this;
  }

  /**
   * Center the text (hori + verti)
   *
   * @return void
   */
  center() {
    this.centerHorizontally();
    this.centerVertically();

    return this;
  }


  /**
   * Return the `x` point of this element
   *
   * @return {Number}
   */
  get x() {
    return this.text.cameraOffset.x - this.container.x;
  }

  /**
   * Set the `x` Point of this element
   *
   * @param {Number} val
   * @return void
   */
  set x(val) {
    this.text.cameraOffset.x = val + this.container.x;
  }

  /**
   * Return the `y` point of this element
   *
   * @return {Number}
   */
  get y() {
    return this.text.cameraOffset.y - this.container.y;
  }

  /**
   * Set the `y` Point of this element
   *
   * @param {Number} val
   * @return void
   */
  set y(val) {
    this.text.cameraOffset.y = val + this.container.y;
  }

  /**
   * Get the current text value
   *
   * @return {String}
   */
  get value() {
    return this.text.text;
  }

  /**
   * Set the text to display
   *
   * @param {String} val
   * @return void
   */
  set value(val) {
    this.text.text = val;
  }
}

export default Text;
