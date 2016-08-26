'use strict';

import Container from '../container';
import BaseRectangle from './baserectangle';

/**
 * A custom DisplayObject
 *
 * The DisplayObject inherits from BaseRectangle
 * but overwrites some methods.
 */
class DisplayObject extends BaseRectangle {

  /**
   * Init the DisplayObject
   *
   * Will set the parameters as class properties,
   * nothing more or less
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {PIXI.DisplayObject} displayObject
   * @param {Number} width
   * @param {Number} height
   */
  constructor(game, x, y, displayObject, width, height) {
    super(game, x, y, width, height);
    this.displayObject = displayObject;

    if(typeof width === 'undefined') {
      this._width = this.game.width;
    }

    if(typeof height === 'undefined') {
      this._height = this.game.height;
    }
  }

  /**
   * Init the DisplayObject
   */
  init() {
    let x = this.container.x = this.container.parent.x + this._x;
    let y = this.container.y = this.container.parent.y + this._y;

    this.container.width =
        Math.min(this.container.parent.width - this._x, this._width);
    this.container.height =
        Math.min(this.container.parent.height - this._y, this._height);

    if(!this.displayObject instanceof Phaser.Sprite) {
      this._sprite = this.game.make.sprite(x, y, this.displayObject);
    } else {
      this._sprite = this.displayObject;
    }

    this.container.displayGroup.add(this._sprite);
    this._sprite.x = x;
    this._sprite.y = y;

    this._offsetX = x;
    this._offsetY = y;

    this._sprite.fixedToCamera = true;
  }

  /**
   * Set the Width of the DisplayObject
   *
   * @param {Number} val
   * @overwrite
   */
  set width(val) {
    this._width = val;
    this._changeDimensions();
  }

  /**
   * Set the Height of the DisplayObject
   *
   * @param {Number} val
   * @overwrite
   */
  set height(val) {
    this._height = val;
    this._changeDimensions();
  }

  /**
   * Get the inputEnabled state of the sprite
   *
   * @return {Boolean}
   */
  get inputEnabled() {
    return this._sprite.inputEnabled;
  }

  /**
   * Set the inputEnabled of the sprite
   * If val is trithy the `.input` property
   * will be exposed to the public.
   *
   * @param {Boolean} val
   * @return void
   */
  set inputEnabled(val) {
    this._sprite.inputEnabled = val;
    this.input = val ? this._sprite.input : null;
  }

  /**
   * Expose the sprite events
   *
   * @return {Object}
   */
  get events() {
    return this._sprite.events;
  }

}

export default DisplayObject;
