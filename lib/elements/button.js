'use strict';

import BaseRectangle from './baserectangle';

class Button extends BaseRectangle {

  /**
   * Init the button
   */
  init() {
    this._border = this.getThemeBorder('slick-ui-theme', 'button');

    let x = this.container.x = this.container.parent.x + this._x;
    let y = this.container.y = this.container.parent.y + this._y;
    let w = this.container.width =
            Math.min(this.container.parent.width - this._x, this._width);
    let h = this.container.height =
            Math.min(this.container.parent.height - this._y, this._height);

    this.container.x += Math.round(this._border.x / 2);
    this.container.y += Math.round(this._border.y / 2);

    let spriteOff = this.cutCreateBitmap(
      'slick-ui-button_off',
      0, 0,
      w, h,
      this._border.x, this._border.y
    );
    let spriteOn = this.cutCreateBitmap(
      'slick-ui-button_on',
      0, 0,
      w, h,
      this._border.x, this._border.y
    );

    this._spriteOff = this.game.make.sprite(x, y, spriteOff);
    this._spriteOn = this.game.make.sprite(x, y, spriteOn);

    this._sprite = this.game.make.button(x, y);
    this._sprite.loadTexture(this._spriteOff.texture);
    this._sprite.fixedToCamera = true;
    this._sprite.x = x;
    this._sprite.y = y;
    this._offsetX = x;
    this._offsetY = y;

    this.container.displayGroup.add(this._sprite);

    this._sprite.events.onInputOver.add(() => {
      this.isHovered = true;
    });
    this._sprite.events.onInputOut.add(() => {
      this.isHovered = false;
    });
    this._sprite.events.onInputDown.add(() => {
      this._sprite.loadTexture(this._spriteOn.texture);
    });
    this._sprite.events.onInputUp.add(() => {
      this._sprite.loadTexture(this._spriteOff.texture);
      if(!this.isHovered) {
        this._sprite.events.onInputUp.halt();
      }
    });

    this.events = this._sprite.events;
  }
}

export default Button;
