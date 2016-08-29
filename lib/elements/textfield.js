'use strict';

import BaseRectangle from './baserectangle';
import { Keyboard, LAYOUT_QWERTZ, LAYOUT_QWERTY } from './keyboard';
import Text from './text';

class TextField extends BaseRectangle {

  /**
   * Construct a new TextField
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {Number} maxChars
   */
  constructor(game, x, y, width, height, maxChars, layout = 'QWERTZ') {
    super(game, x, y, width, height);

    this.maxChars = maxChars || 32;
    this.layout = layout;
    this.value = '';

    this.events = {
      onOK: new Phaser.Signal(),
      onToggle: new Phaser.Signal(),
      onKeyPress: new Phaser.Signal()
    };
  }

  /**
   * Init the textfield
   */
  init() {
    let font = this.getThemeKey('slick-ui-theme', 'fonts');
    let easeMode = Phaser.Easing.Exponential.Out;
    this._border = this.getThemeBorder('slick-ui-theme', 'text_field');

    let x = this.container.x = this.container.parent.x + this._x;
    let y = this.container.y = this.container.parent.y + this._y;
    let w = this.container.width =
            Math.min(this.container.parent.width - this._x, this._width);
    let h = this.container.height =
            Math.min(this.container.parent.height - this._y, this._height);

    this.container.x += Math.round(this._border.x / 2);
    this.container.y += Math.round(this._border.y / 2);
    this.container.width -= this._border.x;
    this.container.height -= this._border.y;

    let bitmap = this.cutCreateBitmap(
      'slick-ui-text_field',
      0, 0,
      w, h,
      this._border.x, this._border.y
    );

    this._sprite = this.game.make.sprite(x, y, bitmap);
    this._sprite.inputEnabled = true;
    this._sprite.input.useHandCursor = true;
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

    let kbAnimating = false;
    let kb = new Keyboard(this.game,
        Object.keys(font)[Object.keys(font).length - 1],
        null,
        true,
        this.layout
    );
    kb.group.cameraOffset.y = this.game.height;
    kb.group.visible = false;

    this._sprite.events.onInputDown.add(() => {
      if(kbAnimating) {
        return;
      }

      kbAnimating = true;

      if(!kb.group.visible) {
        kb.group.visible = true;
        this.game.add.tween(kb.group.cameraOffset)
            .to({
              y: this.game.height - kb.height
            }, 500, easeMode, true)
            .onComplete.add(() => {
              kbAnimating = false;
            });

        this.events.onToggle.dispatch(true);
      } else {
        this.game.add.tween(kb.group.cameraOffset)
            .to({
              y: this.game.height
            }, 500, easeMode, true)
            .onComplete.add(() => {
              kbAnimating = false;
              kb.group.visible = false;
            });

        this.events.onToggle.dispatch(false);
      }
    }, this);


    this.text = new Text(this.game, 8, 0, 'A');
    this.add(this.text);

    this.text.centerVertically();
    this.text.text.text = this.value;

    kb.events.onKeyPress.add((key) => {
      if(key === 'DEL') {
        this.value = this.value.substr(0, this.value.length - 1);
      } else {
        this.value = (this.value + key).substr(0, this.maxChars);
      }

      this.text.text.text = this.value;
      this.events.onKeyPress.dispatch(key);
    });

    kb.events.onOK.add(() => {
      this._sprite.events.onInputDown.dispatch();
      this.events.onOK.dispatch();
    });
  }

  /**
   * Add an element to this container
   *
   * @param {SlickUI.Element} el
   * @return {SlickUI.Element}
   */
  add(el) {
    return this.container.add(el);
  }

}

export {
  TextField as default,
  LAYOUT_QWERTZ,
  LAYOUT_QWERTY
};
