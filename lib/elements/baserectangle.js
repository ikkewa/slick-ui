'use strict';

import Container from '../container';

/**
 * Base object for rectangle shape of DisplayObject
 *
 * @TODO this is a class currently, but should be a composible 
 * object or even a mixin, but for now the class version...
 */
class BaseRectangle {
  /**
   * Init the rectangle shaped form
   *
   * Will set the parameters as class properties,
   * nothing more or less
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   */
  constructor(game, x, y, width, height) {
    this.game = game;
    this._x = x;
    this._y = y;
    this._offsetX = x;
    this._offsetY = y;
    this._width = width;
    this._height = height;
    this._border = null;
    this.container = null;
    this.isHovered = false;
  }

  /**
   * Set the Display Continer of the current element
   *
   * @param {SlickUI.Container} container
   * @return void
   */
  setContainer(container) {
    this.container = new Container(this.game, container);
  }

  /**
   * Add an element as a child to this container
   *
   * @param {Object} element
   * @return {Object} element
   */
  add(element) {
    return this.container.add(this.game, element);
  }

  /**
   * Cut and Create a bitmap for an element
   *
   * This method will use the params given and
   * create a `Phaser.BitmapData` with the cutted
   * parts of the NinePatch Image. THen it will
   * return only the BitMapData.
   *
   * @param {String} texture
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Number} borderX
   * @param {Number} borderY
   * @return {Phaser.BitmapData}
   */
  cutCreateBitmap(texture, x, y, width, height, borderX, borderY) {
    let obj = this.game.make.sprite(x, y, texture);
    let bitmap = this.game.add.bitmapData(width, height);
    let REC = Phaser.Rectangle;

    // TOP LEFT CORNER
    bitmap.copyRect(
        obj, new REC(0, 0, borderX, borderY));

    // TOP RIGHT CORNER
    bitmap.copyRect(
        obj,
        new REC(obj.width - borderX, 0, borderX, borderY),
        width - borderX);

    // TOP BORDER
    bitmap.copy(
        obj,
        borderX + 1, 0, 1, borderY, // sx, sy, sw, sh
        borderX, 0, width - borderX * 2, borderY); // tx, ty, tw, th


    // LEFT BORDER
    bitmap.copy(
        obj,
        0, borderY + 1, borderX, 1, // sx, sy, sw, sh
        0, borderY, borderX, height - borderY * 2); // tx, ty, tw, th

    // RIGHT BORDER
    bitmap.copy(
        obj,
        obj.width - borderX, borderY + 1, borderX, 1, // sx, sy, sw, sh
        width - borderX, borderY, borderX, height - borderY * 2); // tx, ty, tw, th


    // LEFT BOTTOM CORNER
    bitmap.copyRect(
        obj,
        new REC(0, obj.height - borderX, borderX, borderX),
        0, height - borderY);

    // RIGHT BOTTOM CORNER
    bitmap.copyRect(
        obj,
        new REC(obj.width - borderX, obj.height - borderY, borderX, borderY),
        width - borderX, height - borderY);

    // BOTTOM BORDER
    bitmap.copy(
        obj,
        borderX + 1, obj.height - borderY, 1, borderY, // sx, sy, sw, sh
        borderX, height - borderY, width - borderX * 2, borderY); // tx, ty, tw, th

    // BODY
    bitmap.copy(
        obj,
        borderX, borderY, 1, 1, // sx, sy, sw, sh
        borderX, borderY, width - borderX * 2, height - borderY * 2); // tx, ty, tw, th

    return bitmap;
  }

  /**
   * Returns the Theme Border for the given type
   *
   * Loads the definition JSON from cache and extracts
   * the border padding values for the given type.
   *
   * @param {String} key the cache key to lookup
   * @param {String} typ the typ of border padding to get
   * @return {Object} x, y properties
   */
  getThemeBorder(key, typ) {
    let theme = this.game.cache.getJSON(key);

    if(!theme || !theme[typ]) {
      return {x: 0, y: 0};
    }

    return {
      x: theme[typ]['border-x'],
      y: theme[typ]['border-y']
    }
  }

  /**
   * Change the dimension of the element
   * This is used when the width or height is changed
   * and is an internal function that should not be triggered
   * from outside
   *
   * @param {Number} width
   * @param {Number} height
   * @return void
   */
  _changeDimensions(width = null, height = null) {

    if(width) {
      this._width = Math.round(width + this._border.x);
    }

    if(height) {
      this._height = Math.round(height + this._border.y);
    }

    this._sprite.destroy();
    this.init();
    this.container.displayGroup.sendToBack(this._sprite);
  }


  /**
   * Return the `x` point of this element
   *
   * @return {Number}
   */
  get x() {
    return this._x - this.container.parent.x;
  }

  /**
   * Set the `x` Point of this element
   *
   * @param {Number} val
   * @return void
   */
  set x(val) {
    this._x = val;
    this.container.displayGroup.x =
          this.container.parent.x + val - this._offsetX;
  }

  /**
   * Return the `y` point of this element
   *
   * @return {Number}
   */
  get y() {
    return this._y - this.container.parent.y;
  }

  /**
   * Set the `y` Point of this element
   *
   * @param {Number} val
   * @return void
   */
  set y(val) {
    this._y = val;
    this.container.displayGroup.y =
          this.container.parent.y + val - this._offsetY;
  }

  /**
   * Get the visible state of
   * the parent container object
   *
   * @return {Boolean}
   */
  get visible() {
    return this.container.displayGroup.visible;
  }

  /**
   * Set this elements visible state
   * by setting the parent container element
   * visible state
   *
   * @param {Boolean} val
   * @return void
   */
  set visible(val) {
    this.container.displayGroup.visible = val;
  }

  /**
   * Get the alpha value of this element
   * by getting the containers alpha value
   *
   * @return {Float}
   */
  get alpha() {
    return this.container.displayGroup.alpha;
  }

  /**
   * Set the alpha value for this element
   * by setting the container alpha value.
   *
   * @param {Float} val
   * @return void
   */
  set alpha(val) {
    this.container.displayGroup.alpha = val;
  }

  /**
   * Get the with of the elements container
   *
   * @return {Number}
   */
  get width() {
    return this.container.width;
  }

  /**
   * Set the width of the elements container
   *
   * @param {Number} val
   * @return void
   */
  set width(val) {
    this._changeDimensions(val, null);
  }

  /**
   * Set the height of the elements container
   *
   * @return {Number}
   */
  get height() {
    return this.container.height;
  }

  /**
   * Set the height of the elements container
   *
   * @param {Number} val
   * @return void
   */
  set height(val) {
    this._changeDimensions(null, height);
  }
}

export default BaseRectangle;
