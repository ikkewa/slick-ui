'use strict';

import Container from '../container';

class Panel {
  /**
   * Construct the panel
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
    this.container = null;
  }

  /**
   * Set the Display Container of the current element
   *
   * @param {SlickUI.Container} container
   * @return void
   */
  setContainer(container) {
    this.container = new Container(this.game, container);
  }

  /**
   * Add an element as a child to this Panel
   *
   * @param {Element} element
   * @return {Element} element
   */
  add(element) {
    return this.container.add(this.game, element);
  }

  /**
   * Init the panel system
   */
  init() {
    let theme = this.game.cache.getJSON('slick-ui-theme');
    let border = {
      x: theme.panel['border-x'],
      y: theme.panel['border-y']
    }

    let x = this.container.x = this.container.parent.x + this._x;
    let y = this.container.y = this.container.parent.y + this._y;
    let w = this.container.width =
            Math.min(this.container.parent.width - this._x, this._width);
    let h = this.container.height =
            Math.min(this.container.parent.height - this._y, this._height);

    this.container.x += Math.round(border.x / 2);
    this.container.y += Math.round(border.y / 2);
    this.container.width -= _border.x;
    this.container.height -= border.y;

    let panel = this.game.make.sprite(0, 0, 'slick-ui-panel');
    let bitmap = this.game.add.BitmapData(w, h);
    let REC = Phaser.Rectangle;


    // TOP LEFT CORNER
    bitmap.copyRect(
        panel, new REC(0, 0, border.x, border.y));

    // TOP RIGHT CORNER
    bitmap.copyRect(
        panel,
        new REC(panel.width - border.x, 0, border.x, border.y),
        w - border.x);

    // TOP BORDER
    bitmap.copy(
        panel,
        border.x + 1, 0, 1, border.y, // sx, sy, sw, sh
        border.x, 0, w - border.x * 2, border.y); // tx, ty, tw, th


    // LEFT BORDER
    bitmap.copy(
        panel,
        0, border.y + 1, border.x, 1, // sx, sy, sw, sh
        0, border.y, border.x, h - border.y * 2); // tx, ty, tw, th

    // RIGHT BORDER
    bitmap.copy(
        panel,
        panel.width - border.x, border.y + 1, border.x, 1, // sx, sy, sw, sh
        w - border.x, border.y, border.x, h - border.y * 2); // tx, ty, tw, th


    // LEFT BOTTOM CORNER
    bitmap.copyRect(
        panel,
        new REC(0, panel.height - border.x, border.x, border.x),
        0, h - border.y);

    // RIGHT BOTTOM CORNER
    bitmap.copyRect(
        panel,
        new REC(panel.width - border.x, panel.height - border.y, border.x, border.y),
        w - border.x, h - border.y);

    // BOTTOM BORDER
    bitmap.copy(
        panel,
        border.x + 1, panel.height - border.y, 1, border.y, // sx, sy, sw, sh
        border.x, h - border.y, w - border.x * 2, border.y); // tx, ty, tw, th

    // BODY
    bitmap.copy(
        panel,
        border.x, border.y, 1, 1, // sx, sy, sw, sh
        border.x, border.y, w - border.x * 2, h - border.y * 2); // tx, ty, tw, th


    this._sprite = this.container.displayGroup.create(x, y, bitmap);
    this._sprite.fixedToCamera = true;
    this._offsetX = x;
    this._offsetY = y;
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
    this.container.displayGroup.x = this.container.parent.x + val - this._offsetX;
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
    this.container.displayGroup.y = this.container.parent.y + val - this._offsetY;
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
    let theme = this.game.cache.getJSON('slick-ui-theme');
    let border = {
      x: theme.panel['border-x'],
      y: theme.panel['border-y']
    }

    if(width) {
      this._width = Math.round(width + border.x);
    }

    if(height) {
      this._height = Math.round(height + border.y);
    }

    this._sprite.destroy();
    this.init();
    this.container.displayGroup.sendToBack(this._sprite);
  }
}

export default Panel;
