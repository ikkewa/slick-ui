'use strict';

import Container from '../container';
import BaseRectangle from './baserectangle';

class Panel extends BaseRectangle {

  /**
   * Init the panel system
   */
  init() {
    this._border = this.getThemeBorder('slick-ui-theme', 'panel');

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

    let bitmap = this.cutCreateBitmap(
      'slick-ui-panel',
      0, 0,
      this.game.width, this.game.height,
      this._border.x, this._border.y
    );

    this._sprite = this.container.displayGroup.create(x, y, bitmap);
    this._sprite.fixedToCamera = true;
    this._offsetX = x;
    this._offsetY = y;
  }
}

export default Panel;
