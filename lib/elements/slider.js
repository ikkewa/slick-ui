'use strict';


/**
 * Definition of a Slider Object
 */
class Slider {

  /**
   * Construct a new Slider Object
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {Number} size
   * @param {Number} val
   */
  constructor(game, x, y, size, val) {
    this.game = game;
    this._x = x;
    this._y = y;
    this._width = size;
    this._val = !val ? 1 : val;
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


  init() {
    let theme = this.game.cache.getJSON('slick-ui-theme');

    this.onDragStart = new Phaser.Signal();
    this.onDragStop = new Phaser.Signal();
    this.onDrag = new Phaser.Signal();

    let x = this.container.x + this._x;
    let y = this.container.y + this._y;
    let w = Math.min(this.container.width + this._x, this._width);
    let initPos = Math.min(1, Math.max(0, this._val)) * w + x;

    let sprite_base = this.game.make.sprite(0, 0, 'slick-ui-slider_base');
    let sprite_end = this.game.make.sprite(0, 0, 'slick-ui-slider_end');
    let sprite_handle;

    let bitmap = this.game.add.bitmapData(w, sprite_end.height);

    bitmap.copy(
      sprite_base,
      0,
      0,
      1,
      sprite_base.height,
      0,
      Math.round(sprite_end.height / 4),
      w,
      sprite_base.height);

    bitmap.copy(
      sprite_end,
      0,
      0,
      sprite_end.width,
      sprite_end.height,
      0,
      0,
      sprite_end.width,
      sprite_end.height);

    bitmap.copy(
      sprite_end,
      0,
      0,
      sprite_end.width,
      sprite_end.height,
      w - sprite_end.width,
      0,
      sprite_end.width,
      sprite_end.height);

    let handle_off = this.game.make.sprite(0, 0, 'slick-ui-slider_handle_off');
    let handle_on = this.game.make.sprite(0, 0, 'slick-ui-slider_handle_on');

    sprite_base = this.game.make.sprite(x, y, bitmap);
    sprite_handle = this.game.make.sprite(initPos, y, 'slick-ui-slider_handle_off');
    sprite_handle.anchor.setTo(0.5);
    sprite_handle.inputEnabled = true;
    sprite_handle.input.useHandCursor = true;

    let dragging = false;

    sprite_handle.events.onInputDown.add(() => {
      sprite_handle.loadTexture(handle_on.texture);
      dragging = true;
      this.onDragStart.dispatch((sprite_handle.x - x) / w);
    }, this);

    sprite_handle.events.onInputUp.add(() => {
      sprite_handle.loadTexture(handle_off.texture);
      dragging = false;
      this.onDragStop.dispatch((sprite_handle.x - x) / w);
    }, this);

    this.game.input.addMoveCallback((pnt, pntx) => {
      if(!dragging) {
        return;
      }

      sprite_handle.x =
          Math.min(x + w, Math.max(x, pntx - this.container.displayGroup.x));
      this.onDrag.dispatch((sprite_handle.x - x) / w);
    }, this);

    this.container.displayGroup.add(sprite_base);
    this.container.displayGroup.add(sprite_handle);
  }
}

export default Slider
