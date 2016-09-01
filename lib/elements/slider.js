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
    this.onDragStart = new Phaser.Signal();
    this.onDragStop = new Phaser.Signal();
    this.onDrag = new Phaser.Signal();

    let x = this.container.x + this._x;
    let y = this.container.y + this._y;
    let w = Math.min(this.container.width + this._x, this._width);
    let initPos = (Math.min(1, Math.max(0, this._val)) * w) + x;

    let spriteBase = this.game.make.sprite(0, 0, 'slick-ui-slider_base');
    let spriteEnd = this.game.make.sprite(0, 0, 'slick-ui-slider_end');
    let spriteHandle;

    let bitmap = this.game.add.bitmapData(w, spriteEnd.height);

    bitmap.copy(
      spriteBase,
      0,
      0,
      1,
      spriteBase.height,
      2,
      Math.round(spriteEnd.height / 4),
      w - 4,
      spriteBase.height);

    bitmap.copy(
      spriteEnd,
      0,
      0,
      spriteEnd.width,
      spriteEnd.height,
      0,
      0,
      spriteEnd.width,
      spriteEnd.height);

    bitmap.copy(
      spriteEnd,
      0,
      0,
      spriteEnd.width,
      spriteEnd.height,
      w - spriteEnd.width,
      0,
      spriteEnd.width,
      spriteEnd.height);

    let handleOff = this.game.make.sprite(0, 0, 'slick-ui-slider_handle_off');
    let handleOn = this.game.make.sprite(0, 0, 'slick-ui-slider_handle_on');

    spriteBase = this.game.make.sprite(x, y, bitmap);
    spriteHandle = this.game.make.sprite(initPos, y, 'slick-ui-slider_handle_off');
    spriteHandle.anchor.setTo(0.5);
    spriteHandle.inputEnabled = true;
    spriteHandle.input.useHandCursor = true;

    let dragging = false;

    spriteHandle.events.onInputDown.add(() => {
      spriteHandle.loadTexture(handleOn.texture);
      dragging = true;
      this.onDragStart.dispatch((spriteHandle.x - x) / w);
    }, this);

    spriteHandle.events.onInputUp.add(() => {
      spriteHandle.loadTexture(handleOff.texture);
      dragging = false;
      this.onDragStop.dispatch((spriteHandle.x - x) / w);
    }, this);

    this.game.input.addMoveCallback((pnt, pntx) => {
      if(!dragging) {
        return;
      }

      spriteHandle.x =
          Math.min(x + w, Math.max(x, pntx - this.container.displayGroup.x));
      this.onDrag.dispatch((spriteHandle.x - x) / w);
    }, this);

    this.container.displayGroup.add(spriteBase);
    this.container.displayGroup.add(spriteHandle);
  }
}

export default Slider;
