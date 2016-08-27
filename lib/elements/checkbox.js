'use strict';

const TYPE_CHECKBOX = 'check';
const TYPE_RADIO = 'radio';
const TYPE_CROSS = 'cross';

const MAP_TYPE = [ TYPE_CHECKBOX, TYPE_CROSS, TYPE_RADIO ];

/**
 * Definition of Checkbox Class
 */
class Checkbox {

  /**
   * Construct a new Checkbox
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {TYPE_*} type
   */
  constructor(game, x, y, type) {
    this.game = game;
    this._x = x;
    this._y = y;
    this._checked = false;
    this.type = type;
    this.container = null;

    if(typeof type === 'undefined') {
      this.type = TYPE_CHECKBOX;
    }
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
    let x = this.container.x + this._x;
    let y = this.container.y + this._y;

    if(MAP_TYPE.indexOf(this.type) === -1) {
      this.type = 'check';
    }

    this._sprite = this.game.make.sprite(x, y,
                        'slick-ui-' + this.type + '_off');
    this._spriteOff = this.game.make.sprite(0, 0,
                        'slick-ui-' + this.type + '_off');
    this._spriteOn = this.game.make.sprite(0, 0,
                        'slick-ui-' + this.type + '_on');

    this.displayGroup = this.game.add.group();
    this.displayGroup.add(this._sprite);

    this.container.displayGroup.add(this.displayGroup);

    this._sprite.inputEnabled = true;
    this._sprite.fixedToCamera = true;

    this.input.useHandCursor = true;

    this.events.onInputDown.add(() => {
      this.checked = !this.checked;
    }, this);
  }

  /**
   * Return the `x` point of this element
   *
   * @return {Number}
   */
  get x() {
    return this.displayGroup.x + this._x;
  }

  /**
   * Set the `x` Point of this element
   *
   * @param {Number} val
   * @return void
   */
  set x(val) {
    this.displayGroup.x = val - this._x;
  }

  /**
   * Return the `y` point of this element
   *
   * @return {Number}
   */
  get y() {
    return this.displayGroup.y + this._y;
  }

  /**
   * Set the `y` Point of this element
   *
   * @param {Number} val
   * @return void
   */
  set y(val) {
    this.displayGroup.y = val - this._y;
  }

  /**
   * Return the checked state of this element
   *
   * @param {Boolean}
   */
  get checked() {
    return this._checked;
  }

  /**
   * Set the checked value
   *
   * @param {Boolean} val
   * @return void
   */
  set checked(val) {
    this._checked = val;
    this._sprite.loadTexture(
      val ? this._spriteOn.texture : this._spriteOff.texture
    );
  }

  /**
   * Get the visible state
   *
   * @return {Boolean}
   */
  get visible() {
    return this._sprite.visible;
  }

  /**
   * Set this elements visible state
   *
   * @param {Boolean} val
   * @return void
   */
  set visible(val) {
    this._sprite.visible = val;
  }

  /**
   * Get the alpha value of this element
   *
   * @return {Float}
   */
  get alpha() {
    return this._sprite.alpha;
  }

  /**
   * Set the alpha value for this element
   *
   * @param {Float} val
   * @return void
   */
  set alpha(val) {
    this._sprite.alpha = val;
  }

  /**
   * Return the events of the underlying sprite element
   *
   * @return {Phaser.Events}
   */
  get events() {
    return this._sprite.events;
  }

  /**
   * Get the Phaser.Input Object
   *
   * @return {Phaser.InputHandler}
   */
  get input() {
    return this._sprite.input;
  }

  /**
   * Get the with of the element
   *
   * @return {Number}
   */
  get width() {
    return this._sprite.width;
  }

  /**
   * Set the width of the element
   *
   * @param {Number} val
   * @return void
   */
  set width(val) {
    this._sprite.width = val;
  }

  /**
   * Set the height of the element
   *
   * @return {Number}
   */
  get height() {
    return this._sprite.height;
  }

  /**
   * Set the height of the element
   *
   * @param {Number} val
   * @return void
   */
  set height(val) {
    this._sprite.height = val;
  }
}

// overload the class to access the types
Checkbox.TYPE_CHECKBOX = TYPE_CHECKBOX;
Checkbox.TYPE_CROSS = TYPE_CROSS;
Checkbox.TYPE_RADIO = TYPE_RADIO;

export default Checkbox;
