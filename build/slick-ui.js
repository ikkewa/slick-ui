(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = function () {

  /**
   * Construct a new Container
   * Set the bases for all operations.
   *
   * @param {Phaser.Game} game
   * @param {PIXI.DisplayObject} parent
   */
  function Container(game, parent) {
    _classCallCheck(this, Container);

    this.game = game;
    this.parent = parent;
    this.children = [];
    this.displayGroup = this.game.add.group();

    if (parent) {
      parent.displayGroup.add(this.displayGroup);
      this.x = parent.x;
      this.y = parent.y;
      this.width = parent.width;
      this.height = parent.height;
    } else {
      this.x = 0;
      this.y = 0;
      this.width = this.game.width;
      this.height = this.game.height;
    }
  }

  /**
   * Add an element to the container as
   * a child of this container
   *
   * @param {Element} element
   * @return {Element}
   */


  _createClass(Container, [{
    key: 'add',
    value: function add(element) {

      element.setContainer(this);

      if (typeof element.init === 'function') {
        // init the element if available
        element.init();
      }

      this.game.world.bringToTop(this.displayGroup);
      this.children.push(element);

      return element;
    }
  }]);

  return Container;
}();

exports.default = Container;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _container = require('../container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base object for rectangle shape of DisplayObject
 *
 * @TODO this is a class currently, but should be a composible
 * object or even a mixin, but for now the class version...
 */
var BaseRectangle = function () {

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
  function BaseRectangle(game, x, y, width, height) {
    _classCallCheck(this, BaseRectangle);

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


  _createClass(BaseRectangle, [{
    key: 'setContainer',
    value: function setContainer(container) {
      this.container = new _container2.default(this.game, container);
    }

    /**
     * Add an element as a child to this container
     *
     * @param {Object} element
     * @return {Object} element
     */

  }, {
    key: 'add',
    value: function add(element) {
      return this.container.add(element);
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
     * @param {Number} bmWidth
     * @param {Number} bmHeight
     * @return {Phaser.BitmapData}
     */

  }, {
    key: 'cutCreateBitmap',
    value: function cutCreateBitmap(texture, x, y, width, height, borderX, borderY, bmWidth, bmHeight) {
      var obj = this.game.make.sprite(x, y, texture);
      var bitmap = this.game.add.bitmapData(width, height);
      var REC = Phaser.Rectangle;
      bmWidth = bmWidth || width;
      bmHeight = bmHeight || height;

      // TOP LEFT CORNER
      bitmap.copyRect(obj, new REC(0, 0, borderX, borderY));

      // TOP RIGHT CORNER
      bitmap.copyRect(obj, new REC(obj.width - borderX, 0, borderX, borderY), bmWidth - borderX);

      // TOP BORDER
      bitmap.copy(obj, borderX + 1, 0, 1, borderY, // sx, sy, sw, sh
      borderX, 0, bmWidth - borderX * 2, borderY); // tx, ty, tw, th


      // LEFT BORDER
      bitmap.copy(obj, 0, borderY + 1, borderX, 1, // sx, sy, sw, sh
      0, borderY, borderX, bmHeight - borderY * 2); // tx, ty, tw, th

      // RIGHT BORDER
      bitmap.copy(obj, obj.width - borderX, borderY + 1, borderX, 1, // sx, sy, sw, sh
      bmWidth - borderX, borderY, borderX, bmHeight - borderY * 2); // tx, ty, tw, th


      // LEFT BOTTOM CORNER
      bitmap.copyRect(obj, new REC(0, obj.height - borderX, borderX, borderX), 0, bmHeight - borderY);

      // RIGHT BOTTOM CORNER
      bitmap.copyRect(obj, new REC(obj.width - borderX, obj.height - borderY, borderX, borderY), bmWidth - borderX, bmHeight - borderY);

      // BOTTOM BORDER
      bitmap.copy(obj, borderX + 1, obj.height - borderY, 1, borderY, // sx, sy, sw, sh
      borderX, bmHeight - borderY, bmWidth - borderX * 2, borderY); // tx, ty, tw, th

      // BODY
      bitmap.copy(obj, borderX, borderY, 1, 1, // sx, sy, sw, sh
      borderX, borderY, bmWidth - borderX * 2, bmHeight - borderY * 2); // tx, ty, tw, th

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

  }, {
    key: 'getThemeBorder',
    value: function getThemeBorder(key, typ) {
      var theme = this.getThemeKey(key, typ);

      if (!theme) {
        return {
          x: 0, y: 0
        };
      }

      return {
        x: theme['border-x'],
        y: theme['border-y']
      };
    }

    /**
     * Get a key from the given theme
     *
     * @param {String} key
     * @param {String} typ
     * @return {Object|false}
     */

  }, {
    key: 'getThemeKey',
    value: function getThemeKey(key, typ) {
      var theme = this.game.cache.getJSON(key);

      if (!theme || !theme[typ]) {
        return false;
      }

      return theme[typ];
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

  }, {
    key: '_changeDimensions',
    value: function _changeDimensions() {
      var width = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
      var height = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];


      if (width) {
        this._width = Math.round(width + this._border.x);
      }

      if (height) {
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

  }, {
    key: 'x',
    get: function get() {
      return this._x - this.container.parent.x;
    }

    /**
     * Set the `x` Point of this element
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this._x = val;
      this.container.displayGroup.x = this.container.parent.x + val - this._offsetX;
    }

    /**
     * Return the `y` point of this element
     *
     * @return {Number}
     */

  }, {
    key: 'y',
    get: function get() {
      return this._y - this.container.parent.y;
    }

    /**
     * Set the `y` Point of this element
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this._y = val;
      this.container.displayGroup.y = this.container.parent.y + val - this._offsetY;
    }

    /**
     * Get the visible state of
     * the parent container object
     *
     * @return {Boolean}
     */

  }, {
    key: 'visible',
    get: function get() {
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
    ,
    set: function set(val) {
      this.container.displayGroup.visible = val;
    }

    /**
     * Get the alpha value of this element
     * by getting the containers alpha value
     *
     * @return {Float}
     */

  }, {
    key: 'alpha',
    get: function get() {
      return this.container.displayGroup.alpha;
    }

    /**
     * Set the alpha value for this element
     * by setting the container alpha value.
     *
     * @param {Float} val
     * @return void
     */
    ,
    set: function set(val) {
      this.container.displayGroup.alpha = val;
    }

    /**
     * Get the with of the elements container
     *
     * @return {Number}
     */

  }, {
    key: 'width',
    get: function get() {
      return this.container.width;
    }

    /**
     * Set the width of the elements container
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this._changeDimensions(val, null);
    }

    /**
     * Set the height of the elements container
     *
     * @return {Number}
     */

  }, {
    key: 'height',
    get: function get() {
      return this.container.height;
    }

    /**
     * Set the height of the elements container
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this._changeDimensions(null, val);
    }
  }]);

  return BaseRectangle;
}();

exports.default = BaseRectangle;

},{"../container":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baserectangle = require('./baserectangle');

var _baserectangle2 = _interopRequireDefault(_baserectangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_BaseRectangle) {
  _inherits(Button, _BaseRectangle);

  function Button() {
    _classCallCheck(this, Button);

    return _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
  }

  _createClass(Button, [{
    key: 'init',


    /**
     * Init the button
     */
    value: function init() {
      var _this2 = this;

      this._border = this.getThemeBorder('slick-ui-theme', 'button');

      var x = this.container.x = this.container.parent.x + this._x;
      var y = this.container.y = this.container.parent.y + this._y;
      var w = this.container.width = Math.min(this.container.parent.width - this._x, this._width);
      var h = this.container.height = Math.min(this.container.parent.height - this._y, this._height);

      this.container.x += Math.round(this._border.x / 2);
      this.container.y += Math.round(this._border.y / 2);

      var spriteOff = this.cutCreateBitmap('slick-ui-button_off', 0, 0, w, h, this._border.x, this._border.y);
      var spriteOn = this.cutCreateBitmap('slick-ui-button_on', 0, 0, w, h, this._border.x, this._border.y);

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

      this._sprite.events.onInputOver.add(function () {
        _this2.isHovered = true;
      });
      this._sprite.events.onInputOut.add(function () {
        _this2.isHovered = false;
      });
      this._sprite.events.onInputDown.add(function () {
        _this2._sprite.loadTexture(_this2._spriteOn.texture);
      });
      this._sprite.events.onInputUp.add(function () {
        _this2._sprite.loadTexture(_this2._spriteOff.texture);
        if (!_this2.isHovered) {
          _this2._sprite.events.onInputUp.halt();
        }
      });

      this.events = this._sprite.events;
    }
  }]);

  return Button;
}(_baserectangle2.default);

exports.default = Button;

},{"./baserectangle":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TYPE_CHECKBOX = 'check';
var TYPE_RADIO = 'radio';
var TYPE_CROSS = 'cross';

var MAP_TYPE = [TYPE_CHECKBOX, TYPE_CROSS, TYPE_RADIO];

/**
 * Definition of Checkbox Class
 */

var Checkbox = function () {

  /**
   * Construct a new Checkbox
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {TYPE_*} type
   */
  function Checkbox(game, x, y, type) {
    _classCallCheck(this, Checkbox);

    this.game = game;
    this._x = x;
    this._y = y;
    this._checked = false;
    this.type = type;
    this.container = null;

    if (typeof type === 'undefined') {
      this.type = TYPE_CHECKBOX;
    }
  }

  /**
   * Set the parent Container object
   *
   * @param {Container}
   * @return void
   */


  _createClass(Checkbox, [{
    key: 'setContainer',
    value: function setContainer(container) {
      this.container = container;
    }

    /**
     * Init the object
     */

  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      var x = this.container.x + this._x;
      var y = this.container.y + this._y;

      if (MAP_TYPE.indexOf(this.type) === -1) {
        this.type = 'check';
      }

      this._sprite = this.game.make.sprite(x, y, 'slick-ui-' + this.type + '_off');
      this._spriteOff = this.game.make.sprite(0, 0, 'slick-ui-' + this.type + '_off');
      this._spriteOn = this.game.make.sprite(0, 0, 'slick-ui-' + this.type + '_on');

      this.displayGroup = this.game.add.group();
      this.displayGroup.add(this._sprite);

      this.container.displayGroup.add(this.displayGroup);

      this._sprite.inputEnabled = true;
      this._sprite.fixedToCamera = true;

      this.input.useHandCursor = true;

      this.events.onInputDown.add(function () {
        _this.checked = !_this.checked;
      }, this);
    }

    /**
     * Return the `x` point of this element
     *
     * @return {Number}
     */

  }, {
    key: 'x',
    get: function get() {
      return this.displayGroup.x + this._x;
    }

    /**
     * Set the `x` Point of this element
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this.displayGroup.x = val - this._x;
    }

    /**
     * Return the `y` point of this element
     *
     * @return {Number}
     */

  }, {
    key: 'y',
    get: function get() {
      return this.displayGroup.y + this._y;
    }

    /**
     * Set the `y` Point of this element
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this.displayGroup.y = val - this._y;
    }

    /**
     * Return the checked state of this element
     *
     * @param {Boolean}
     */

  }, {
    key: 'checked',
    get: function get() {
      return this._checked;
    }

    /**
     * Set the checked value
     *
     * @param {Boolean} val
     * @return void
     */
    ,
    set: function set(val) {
      this._checked = val;
      this._sprite.loadTexture(val ? this._spriteOn.texture : this._spriteOff.texture);
    }

    /**
     * Get the visible state
     *
     * @return {Boolean}
     */

  }, {
    key: 'visible',
    get: function get() {
      return this._sprite.visible;
    }

    /**
     * Set this elements visible state
     *
     * @param {Boolean} val
     * @return void
     */
    ,
    set: function set(val) {
      this._sprite.visible = val;
    }

    /**
     * Get the alpha value of this element
     *
     * @return {Float}
     */

  }, {
    key: 'alpha',
    get: function get() {
      return this._sprite.alpha;
    }

    /**
     * Set the alpha value for this element
     *
     * @param {Float} val
     * @return void
     */
    ,
    set: function set(val) {
      this._sprite.alpha = val;
    }

    /**
     * Return the events of the underlying sprite element
     *
     * @return {Phaser.Events}
     */

  }, {
    key: 'events',
    get: function get() {
      return this._sprite.events;
    }

    /**
     * Get the Phaser.Input Object
     *
     * @return {Phaser.InputHandler}
     */

  }, {
    key: 'input',
    get: function get() {
      return this._sprite.input;
    }

    /**
     * Get the with of the element
     *
     * @return {Number}
     */

  }, {
    key: 'width',
    get: function get() {
      return this._sprite.width;
    }

    /**
     * Set the width of the element
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this._sprite.width = val;
    }

    /**
     * Set the height of the element
     *
     * @return {Number}
     */

  }, {
    key: 'height',
    get: function get() {
      return this._sprite.height;
    }

    /**
     * Set the height of the element
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this._sprite.height = val;
    }
  }]);

  return Checkbox;
}();

// overload the class to access the types


Checkbox.TYPE_CHECKBOX = TYPE_CHECKBOX;
Checkbox.TYPE_CROSS = TYPE_CROSS;
Checkbox.TYPE_RADIO = TYPE_RADIO;

exports.default = Checkbox;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baserectangle = require('./baserectangle');

var _baserectangle2 = _interopRequireDefault(_baserectangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A custom DisplayObject
 *
 * The DisplayObject inherits from BaseRectangle
 * but overwrites some methods.
 */
var DisplayObject = function (_BaseRectangle) {
  _inherits(DisplayObject, _BaseRectangle);

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
  function DisplayObject(game, x, y, displayObject, width, height) {
    _classCallCheck(this, DisplayObject);

    var _this = _possibleConstructorReturn(this, (DisplayObject.__proto__ || Object.getPrototypeOf(DisplayObject)).call(this, game, x, y, width, height));

    _this.displayObject = displayObject;

    if (typeof width === 'undefined') {
      _this._width = _this.game.width;
    }

    if (typeof height === 'undefined') {
      _this._height = _this.game.height;
    }
    return _this;
  }

  /**
   * Init the DisplayObject
   */


  _createClass(DisplayObject, [{
    key: 'init',
    value: function init() {
      var x = this.container.x = this.container.parent.x + this._x;
      var y = this.container.y = this.container.parent.y + this._y;

      this.container.width = Math.min(this.container.parent.width - this._x, this._width);
      this.container.height = Math.min(this.container.parent.height - this._y, this._height);

      if (!this.displayObject instanceof Phaser.Sprite) {
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

  }, {
    key: 'width',
    set: function set(val) {
      this._width = val;
      this._changeDimensions();
    }

    /**
     * Set the Height of the DisplayObject
     *
     * @param {Number} val
     * @overwrite
     */

  }, {
    key: 'height',
    set: function set(val) {
      this._height = val;
      this._changeDimensions();
    }

    /**
     * Get the inputEnabled state of the sprite
     *
     * @return {Boolean}
     */

  }, {
    key: 'inputEnabled',
    get: function get() {
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
    ,
    set: function set(val) {
      this._sprite.inputEnabled = val;
      this.input = val ? this._sprite.input : null;
    }

    /**
     * Expose the sprite events
     *
     * @return {Object}
     */

  }, {
    key: 'events',
    get: function get() {
      return this._sprite.events;
    }
  }]);

  return DisplayObject;
}(_baserectangle2.default);

exports.default = DisplayObject;

},{"./baserectangle":2}],6:[function(require,module,exports){
'use strict';

/**
 * A key on the keyboard
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Key = function () {

  /**
   * Construct a new key
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @param {String} font
   * @param {Number} fontSize
   * @param {String} text
   */
  function Key(game, x, y, width, height, font, fontSize, text) {
    _classCallCheck(this, Key);

    this.game = game;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this.font = font;
    this.fontSize = fontSize;
    this.text = text;
    this._isHovered = false;

    this.group = this.game.add.group();
  }

  /**
   * Init the key
   */


  _createClass(Key, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var graphicsUp = this._createGraphic(0xcfcfcf, 0xffffff);
      var graphicsDown = this._createGraphic(0x178ab8, 0x1fa7e1);

      var keyUp = this.game.make.sprite(this._x, this._y, graphicsUp.generateTexture());

      var keyDown = this.game.make.sprite(this._x, this._y, graphicsDown.generateTexture());

      var base = this.game.make.sprite(this._x, this._y, keyUp.texture);
      base.inputEnabled = true;
      base.input.useHandCursor = true;

      base.events.onInputDown.add(function () {
        base.loadTexture(keyDown.texture);
      });

      base.events.onInputUp.add(function () {
        base.loadTexture(keyUp.texture);

        if (!_this._isHovered) {
          base.events.onInputUp.halt();
        }
      });

      base.events.onInputOver.add(function () {
        _this._isHovered = true;
      });

      base.events.onInputOut.add(function () {
        _this._isHovered = false;
      });

      var text = this.game.make.bitmapText(this._x, this._y, this.font, this.text, this.fontSize);

      text.x += this._width / 2 - text.width / 2;
      text.y += this._height / 2 - this.fontSize / 2 - 4;

      this.group.add(base);
      this.group.add(text);

      this.events = base.events;
    }

    /**
     * Create the basic graphic for the button
     *
     * use shadow color as border definition
     *
     * @param {Mixed} color1
     * @param {Mixed} color2
     * @return {Phaser.Graphics}
     */

  }, {
    key: '_createGraphic',
    value: function _createGraphic(color1, color2) {
      var graphic = this.game.make.graphics(0, 0);
      graphic.beginFill(color1);
      graphic.drawRoundedRect(0, 0, this._width, this._height, 5);
      graphic.beginFill(color2);
      graphic.drawRoundedRect(1, 1, this._width - 2, this._height - 2, 5);

      return graphic;
    }
  }]);

  return Key;
}();

exports.default = Key;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LAYOUT_QWERTY = exports.LAYOUT_QWERTZ = exports.Keyboard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _key = require('./key');

var _key2 = _interopRequireDefault(_key);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var layouts = {
  QWERTZ: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'DEL'], ['q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', '!'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'UPPER'], ['OK', 'y', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ' ']],
  QWERTY: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'DEL'], ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '!'], ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'UPPER'], ['OK', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ' ']]
};

var specialWidths = {
  DEL: 64,
  UPPER: 80,
  ' ': 80
};

var LAYOUT_QWERTZ = 'QWERTZ';
var LAYOUT_QWERTY = 'QWERTY'; // eslint-disable-line no-unused-vars

/**
 * Definition of the keyboard class
 */

var Keyboard = function () {

  /**
   * Construct a new keyboard
   *
   * @param {String} font
   * @param {Number} fontSize
   * @param {Boolean} initialize
   */
  function Keyboard(game, font, fontSize, initialize) {
    var layout = arguments.length <= 4 || arguments[4] === undefined ? LAYOUT_QWERTZ : arguments[4];

    _classCallCheck(this, Keyboard);

    this.game = game;

    this.font = font;
    this.fontSize = fontSize || 16;
    this.layout = layouts[layout];
    this.height = 160;

    this.group = this.game.add.group();
    this.group.fixedToCamera = true;

    this.keyGroupLower = this.game.make.group();
    this.keyGroupUpper = this.game.make.group();

    this.keyGroupCurrent = this.keyGroupLower;
    this.keyGroupUpper.visible = false;

    this.events = {
      onKeyPress: new Phaser.Signal(),
      onOK: new Phaser.Signal()
    };

    if (initialize !== false) {
      this.create();
    }
  }

  /**
   * Create the keyboard layout
   */


  _createClass(Keyboard, [{
    key: 'create',
    value: function create() {
      var _this = this;

      // create the background
      var bitmap = this.game.make.bitmapData(this.game.width, this.height);
      bitmap.ctx.beginPath();
      bitmap.ctx.rect(0, 0, this.game.width, this.height);
      bitmap.ctx.fillStyle = '#cccccc';
      bitmap.ctx.fill();
      bitmap.ctx.beginPath();
      bitmap.ctx.rect(0, 2, this.game.width, this.height);
      bitmap.ctx.fillStyle = '#f0f0f0';
      bitmap.ctx.fill();

      var base = this.game.make.sprite(0, 0, bitmap);
      var keyboardWidth = 440;
      var offsetX = Math.round(this.game.world.centerX - keyboardWidth / 2);

      this.group.add(base);
      this.group.add(this.keyGroupLower);
      this.group.add(this.keyGroupUpper);

      // generate the keys
      this.layout.forEach(function (row, idx) {
        offsetX = idx !== 3 ? offsetX + 16 : offsetX - 32;
        row.forEach(function (k, idk) {
          var x = offsetX + idk * 36;
          var y = 16 + idx * 36;
          var w = specialWidths.hasOwnProperty(k) ? specialWidths[k] : 32;
          var h = 32;
          var keyLow = new _key2.default(_this.game, x, y, w, h, _this.font, _this.fontSize, k);

          _this.addKey(keyLow, _this.keyGroupLower);

          var keyUpp = void 0;
          if (k.toUpperCase().match(/[A-Z]/)) {
            keyUpp = new _key2.default(_this.game, x, y, w, h, _this.font, _this.fontSize, k.toUpperCase());
          } else {
            keyUpp = new _key2.default(_this.game, x, y, w, h, _this.font, _this.fontSize, k);
          }
          _this.addKey(keyUpp, _this.keyGroupUpper);
        });
      });

      this.game.input.keyboard.onPressCallback = function (char) {
        if (_this.group.visible) {
          _this.events.onKeyPress.dispatch(char);
        }
      };
    }

    /**
     * Add a key to the keygroup
     *
     * @param {SlickUI.Key} key
     * @param {Phaser.Group} group
     */

  }, {
    key: 'addKey',
    value: function addKey(key, group) {
      var _this2 = this;

      key.init();

      if (!group) {
        group = this.keyGroupCurrent;
      }

      group.add(key.group);

      key.events.onInputUp.add(function () {
        if (key.text === 'UPPER' || key.text === 'lower') {
          _this2.toggleMode();
          return;
        }

        if (key.text === 'OK') {
          _this2.events.onOK.dispatch();
          return;
        }

        _this2.events.onKeyPress.dispatch(key.text);
      });
    }

    /**
     * Toggle the upper/lower state
     *
     * @return void
     */

  }, {
    key: 'toggleMode',
    value: function toggleMode() {
      this.keyGroupUpper.visible = !this.keyGroupUpper.visible;
      this.keyGroupLower.visible = !this.keyGroupLower.visible;
    }
  }]);

  return Keyboard;
}();

exports.Keyboard = Keyboard;
exports.LAYOUT_QWERTZ = LAYOUT_QWERTZ;
exports.LAYOUT_QWERTY = LAYOUT_QWERTY;

},{"./key":6}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baserectangle = require('./baserectangle');

var _baserectangle2 = _interopRequireDefault(_baserectangle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Panel = function (_BaseRectangle) {
  _inherits(Panel, _BaseRectangle);

  function Panel() {
    _classCallCheck(this, Panel);

    return _possibleConstructorReturn(this, (Panel.__proto__ || Object.getPrototypeOf(Panel)).apply(this, arguments));
  }

  _createClass(Panel, [{
    key: 'init',


    /**
     * Init the panel system
     */
    value: function init() {
      this._border = this.getThemeBorder('slick-ui-theme', 'panel');

      var x = this.container.x = this.container.parent.x + this._x;
      var y = this.container.y = this.container.parent.y + this._y;
      var w = this.container.width = Math.min(this.container.parent.width - this._x, this._width);
      var h = this.container.height = Math.min(this.container.parent.height - this._y, this._height);

      this.container.x += Math.round(this._border.x / 2);
      this.container.y += Math.round(this._border.y / 2);
      this.container.width -= this._border.x;
      this.container.height -= this._border.y;

      var bitmap = this.cutCreateBitmap('slick-ui-panel', 0, 0, this.game.width, this.game.height, this._border.x, this._border.y, w, h);

      this._sprite = this.container.displayGroup.create(x, y, bitmap);
      this._sprite.fixedToCamera = true;
      this._offsetX = x;
      this._offsetY = y;
    }
  }]);

  return Panel;
}(_baserectangle2.default);

exports.default = Panel;

},{"./baserectangle":2}],9:[function(require,module,exports){
'use strict';

/**
 * Definition of a Slider Object
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {

  /**
   * Construct a new Slider Object
   *
   * @param {Phaser.Game} game
   * @param {Number} x
   * @param {Number} y
   * @param {Number} size
   * @param {Number} val
   */
  function Slider(game, x, y, size, val) {
    _classCallCheck(this, Slider);

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


  _createClass(Slider, [{
    key: 'setContainer',
    value: function setContainer(container) {
      this.container = container;
    }
  }, {
    key: 'init',
    value: function init() {
      var _this = this;

      this.onDragStart = new Phaser.Signal();
      this.onDragStop = new Phaser.Signal();
      this.onDrag = new Phaser.Signal();

      var x = this.container.x + this._x;
      var y = this.container.y + this._y;
      var w = Math.min(this.container.width + this._x, this._width);
      var initPos = Math.min(1, Math.max(0, this._val)) * w + x;

      var spriteBase = this.game.make.sprite(0, 0, 'slick-ui-slider_base');
      var spriteEnd = this.game.make.sprite(0, 0, 'slick-ui-slider_end');
      var spriteHandle = void 0;

      var bitmap = this.game.add.bitmapData(w, spriteEnd.height);

      bitmap.copy(spriteBase, 0, 0, 1, spriteBase.height, 0, Math.round(spriteEnd.height / 4), w, spriteBase.height);

      bitmap.copy(spriteEnd, 0, 0, spriteEnd.width, spriteEnd.height, 0, 0, spriteEnd.width, spriteEnd.height);

      bitmap.copy(spriteEnd, 0, 0, spriteEnd.width, spriteEnd.height, w - spriteEnd.width, 0, spriteEnd.width, spriteEnd.height);

      var handleOff = this.game.make.sprite(0, 0, 'slick-ui-slider_handle_off');
      var handleOn = this.game.make.sprite(0, 0, 'slick-ui-slider_handle_on');

      spriteBase = this.game.make.sprite(x, y, bitmap);
      spriteHandle = this.game.make.sprite(initPos, y, 'slick-ui-slider_handle_off');
      spriteHandle.anchor.setTo(0.5);
      spriteHandle.inputEnabled = true;
      spriteHandle.input.useHandCursor = true;

      var dragging = false;

      spriteHandle.events.onInputDown.add(function () {
        spriteHandle.loadTexture(handleOn.texture);
        dragging = true;
        _this.onDragStart.dispatch((spriteHandle.x - x) / w);
      }, this);

      spriteHandle.events.onInputUp.add(function () {
        spriteHandle.loadTexture(handleOff.texture);
        dragging = false;
        _this.onDragStop.dispatch((spriteHandle.x - x) / w);
      }, this);

      this.game.input.addMoveCallback(function (pnt, pntx) {
        if (!dragging) {
          return;
        }

        spriteHandle.x = Math.min(x + w, Math.max(x, pntx - _this.container.displayGroup.x));
        _this.onDrag.dispatch((spriteHandle.x - x) / w);
      }, this);

      this.container.displayGroup.add(spriteBase);
      this.container.displayGroup.add(spriteHandle);
    }
  }]);

  return Slider;
}();

exports.default = Slider;

},{}],10:[function(require,module,exports){
'use strict';

/**
 * A Text Object to display text with a bitmap font
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Text = function () {

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
  function Text(game, x, y, val, size, font, width, height) {
    _classCallCheck(this, Text);

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


  _createClass(Text, [{
    key: 'setContainer',
    value: function setContainer(container) {
      this.container = container;
    }

    /**
     * Init the object
     */

  }, {
    key: 'init',
    value: function init() {
      var theme = this.game.cache.getJSON('slick-ui-theme');
      if (!this.font) {
        var fonts = Object.keys(theme.fonts);
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

  }, {
    key: 'reset',
    value: function reset(x, y, recalcWidth) {
      var w = Math.min(this.container.width - x, this.width);
      var h = Math.min(this.container.height - y, this.height);

      if (this.text) {
        if (recalcWidth === false) {
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

  }, {
    key: 'centerHorizontally',
    value: function centerHorizontally() {
      this.text.cameraOffset.x = this.text.maxWidth / 2 - this.text.width / 2 + this.container.x;
      return this;
    }

    /**
     * Center the text vertically in the container
     *
     * @return void
     */

  }, {
    key: 'centerVertically',
    value: function centerVertically() {
      var theme = this.game.cache.getJSON('slick-ui-theme');
      this.text.cameraOffset.y = this.container.height / 2 - this.text.height / 2 - Math.round(theme.button['border-x'] / 2) + this.container.y;

      return this;
    }

    /**
     * Center the text (hori + verti)
     *
     * @return void
     */

  }, {
    key: 'center',
    value: function center() {
      this.centerHorizontally();
      this.centerVertically();

      return this;
    }

    /**
     * Return the `x` point of this element
     *
     * @return {Number}
     */

  }, {
    key: 'x',
    get: function get() {
      return this.text.cameraOffset.x - this.container.x;
    }

    /**
     * Set the `x` Point of this element
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this.text.cameraOffset.x = val + this.container.x;
    }

    /**
     * Return the `y` point of this element
     *
     * @return {Number}
     */

  }, {
    key: 'y',
    get: function get() {
      return this.text.cameraOffset.y - this.container.y;
    }

    /**
     * Set the `y` Point of this element
     *
     * @param {Number} val
     * @return void
     */
    ,
    set: function set(val) {
      this.text.cameraOffset.y = val + this.container.y;
    }

    /**
     * Get the current text value
     *
     * @return {String}
     */

  }, {
    key: 'value',
    get: function get() {
      return this.text.text;
    }

    /**
     * Set the text to display
     *
     * @param {String} val
     * @return void
     */
    ,
    set: function set(val) {
      this.text.text = val;
    }
  }]);

  return Text;
}();

exports.default = Text;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LAYOUT_QWERTY = exports.LAYOUT_QWERTZ = exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _baserectangle = require('./baserectangle');

var _baserectangle2 = _interopRequireDefault(_baserectangle);

var _keyboard = require('./keyboard');

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextField = function (_BaseRectangle) {
  _inherits(TextField, _BaseRectangle);

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
  function TextField(game, x, y, width, height, maxChars) {
    var layout = arguments.length <= 6 || arguments[6] === undefined ? 'QWERTZ' : arguments[6];

    _classCallCheck(this, TextField);

    var _this = _possibleConstructorReturn(this, (TextField.__proto__ || Object.getPrototypeOf(TextField)).call(this, game, x, y, width, height));

    _this.maxChars = maxChars || 32;
    _this.layout = layout;
    _this.value = '';

    _this.events = {
      onOK: new Phaser.Signal(),
      onToggle: new Phaser.Signal(),
      onKeyPress: new Phaser.Signal()
    };
    return _this;
  }

  /**
   * Init the textfield
   */


  _createClass(TextField, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      var font = this.getThemeKey('slick-ui-theme', 'fonts');
      var easeMode = Phaser.Easing.Exponential.Out;
      this._border = this.getThemeBorder('slick-ui-theme', 'text_field');

      var x = this.container.x = this.container.parent.x + this._x;
      var y = this.container.y = this.container.parent.y + this._y;
      var w = this.container.width = Math.min(this.container.parent.width - this._x, this._width);
      var h = this.container.height = Math.min(this.container.parent.height - this._y, this._height);

      this.container.x += Math.round(this._border.x / 2);
      this.container.y += Math.round(this._border.y / 2);
      this.container.width -= this._border.x;
      this.container.height -= this._border.y;

      var bitmap = this.cutCreateBitmap('slick-ui-text_field', 0, 0, w, h, this._border.x, this._border.y);

      this._sprite = this.game.make.sprite(x, y, bitmap);
      this._sprite.inputEnabled = true;
      this._sprite.input.useHandCursor = true;
      this._sprite.fixedToCamera = true;

      this._sprite.x = x;
      this._sprite.y = y;
      this._offsetX = x;
      this._offsetY = y;
      this.container.displayGroup.add(this._sprite);

      this._sprite.events.onInputOver.add(function () {
        _this2.isHovered = true;
      });
      this._sprite.events.onInputOut.add(function () {
        _this2.isHovered = false;
      });

      var kbAnimating = false;
      var kb = new _keyboard.Keyboard(this.game, Object.keys(font)[Object.keys(font).length - 1], null, true, this.layout);
      kb.group.cameraOffset.y = this.game.height;
      kb.group.visible = false;

      this._sprite.events.onInputDown.add(function () {
        if (kbAnimating) {
          return;
        }

        kbAnimating = true;

        if (!kb.group.visible) {
          kb.group.visible = true;
          _this2.game.add.tween(kb.group.cameraOffset).to({
            y: _this2.game.height - kb.height
          }, 500, easeMode, true).onComplete.add(function () {
            kbAnimating = false;
          });

          _this2.events.onToggle.dispatch(true);
        } else {
          _this2.game.add.tween(kb.group.cameraOffset).to({
            y: _this2.game.height
          }, 500, easeMode, true).onComplete.add(function () {
            kbAnimating = false;
            kb.group.visible = false;
          });

          _this2.events.onToggle.dispatch(false);
        }
      }, this);

      this.text = new _text2.default(this.game, 8, 0, 'A');
      this.add(this.text);

      this.text.centerVertically();
      this.text.text.text = this.value;

      kb.events.onKeyPress.add(function (key) {
        if (key === 'DEL') {
          _this2.value = _this2.value.substr(0, _this2.value.length - 1);
        } else {
          _this2.value = (_this2.value + key).substr(0, _this2.maxChars);
        }

        _this2.text.text.text = _this2.value;
        _this2.events.onKeyPress.dispatch(key);
      });

      kb.events.onOK.add(function () {
        _this2._sprite.events.onInputDown.dispatch();
        _this2.events.onOK.dispatch();
      });
    }

    /**
     * Add an element to this container
     *
     * @param {SlickUI.Element} el
     * @return {SlickUI.Element}
     */

  }, {
    key: 'add',
    value: function add(el) {
      return this.container.add(el);
    }
  }]);

  return TextField;
}(_baserectangle2.default);

exports.default = TextField;
exports.LAYOUT_QWERTZ = _keyboard.LAYOUT_QWERTZ;
exports.LAYOUT_QWERTY = _keyboard.LAYOUT_QWERTY;

},{"./baserectangle":2,"./keyboard":7,"./text":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextField = exports.Keyboard = exports.Key = exports.Checkbox = exports.Text = exports.Slider = exports.Button = exports.Panel = exports.DisplayObject = exports.Container = exports.SlickUI = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

var _displayobject = require('./elements/displayobject');

var _displayobject2 = _interopRequireDefault(_displayobject);

var _panel = require('./elements/panel');

var _panel2 = _interopRequireDefault(_panel);

var _button = require('./elements/button');

var _button2 = _interopRequireDefault(_button);

var _slider = require('./elements/slider');

var _slider2 = _interopRequireDefault(_slider);

var _text = require('./elements/text');

var _text2 = _interopRequireDefault(_text);

var _checkbox = require('./elements/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _key2 = require('./elements/key');

var _key3 = _interopRequireDefault(_key2);

var _keyboard = require('./elements/keyboard');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _textfield = require('./elements/textfield');

var _textfield2 = _interopRequireDefault(_textfield);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// used to map typ to classes, used in create() method
var createMap = {
  panel: _panel2.default,
  button: _button2.default,
  displayobject: _displayobject2.default,
  slider: _slider2.default,
  text: _text2.default,
  checkbox: _checkbox2.default,
  key: _key3.default,
  keyboard: _keyboard2.default,
  textfield: _textfield2.default
};

/**
 * SlickUI Plugin class
 *
 * Load this Class to hook into the Phaser
 * Plugin system. It is used as based to loading
 * textures and adding elements on root level.
 */

var SlickUI = function (_Phaser$Plugin) {
  _inherits(SlickUI, _Phaser$Plugin);

  function SlickUI() {
    _classCallCheck(this, SlickUI);

    return _possibleConstructorReturn(this, (SlickUI.__proto__ || Object.getPrototypeOf(SlickUI)).apply(this, arguments));
  }

  _createClass(SlickUI, [{
    key: 'load',


    /**
     * Load the Theme stuff into the plugin
     *
     * Pass the path to the theme .json file
     * and the method will load everything that
     * is needed and uses the Phaser Cache system.
     *
     * @param {String} theme
     * @return void
     */
    value: function load(theme) {
      var _this2 = this;

      this.container = new _container2.default(this.game);

      var themePath = theme.replace(/\/[^\/]+$/, '/');

      this.game.load.json('slick-ui-theme', theme);
      this.game.load.resetLocked = true;
      this.game.load.start();

      var isQueued = false;
      var queueAssets = function queueAssets() {
        if (!_this2.game.cache.checkJSONKey('slick-ui-theme') || isQueued) {
          return;
        }

        var theme = _this2.game.cache.getJSON('slick-ui-theme');

        Object.keys(theme.images).forEach(function (key) {
          _this2.game.load.image('slick-ui-' + key, themePath + theme.images[key]);
        }, _this2);

        Object.keys(theme.fonts).forEach(function (key) {
          _this2.game.load.bitmapFont(key, themePath + theme.fonts[key][0], themePath + theme.fonts[key][1]);
        }, _this2);

        isQueued = true;
        _this2.game.load.onFileComplete.remove(queueAssets);
      };

      this.game.load.onFileComplete.add(queueAssets, this);
    }

    /**
     * Add an element to the main container
     *
     * @param {Element} element
     * @return {Element
     */

  }, {
    key: 'add',
    value: function add(element) {
      return this.container.add(element);
    }

    /**
     * Create and return an element
     *
     * This method takes the element type as string
     * and additional parameters to create an element
     * of the given type. Valid types are:
     *  - button
     *  - panel
     *  - slider
     *  - displayobject
     *  - key
     *  - keyboard
     *  - textfield
     *  - checkbox
     *
     * All additional given parameters are passed to the
     * constructor of the element to create. There is no
     * validation of the parameter.
     *
     * With this method the need to pass in the `Phaser.Game`
     * instance to the construct is gone. So instead of using
     *    new SlickUI.Button(game, x, y, ...)
     * you can now use
     *    slickinstance.create('button', x, y, ...)
     *
     * @param {String} typ - type of element to create
     * @param {..args} args - args to construct element
     * @return {SlickUI.Element}
     */

  }, {
    key: 'create',
    value: function create(typ) {
      if (createMap.hasOwnProperty(typ)) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return new (Function.prototype.bind.apply(createMap[typ], [null].concat([this.game], args)))();
      }

      return false;
    }
  }]);

  return SlickUI;
}(Phaser.Plugin);

// export via Function overloading


SlickUI.Container = _container2.default;
SlickUI.DisplayObject = _displayobject2.default;
SlickUI.Panel = _panel2.default;
SlickUI.Button = _button2.default;
SlickUI.Slider = _slider2.default;
SlickUI.Text = _text2.default;
SlickUI.Checkbox = _checkbox2.default;
SlickUI.Key = _key3.default;
SlickUI.Keyboard = _keyboard2.default;
SlickUI.TextField = _textfield2.default;

// Export to Phaser.Plugin NS System
if (Phaser && Phaser.Plugin) {
  Phaser.Plugin.SlickUI = SlickUI;
}

// CommonJS exports

exports.SlickUI = SlickUI;
exports.Container = _container2.default;
exports.DisplayObject = _displayobject2.default;
exports.Panel = _panel2.default;
exports.Button = _button2.default;
exports.Slider = _slider2.default;
exports.Text = _text2.default;
exports.Checkbox = _checkbox2.default;
exports.Key = _key3.default;
exports.Keyboard = _keyboard2.default;
exports.TextField = _textfield2.default;

},{"./container":1,"./elements/button":3,"./elements/checkbox":4,"./elements/displayobject":5,"./elements/key":6,"./elements/keyboard":7,"./elements/panel":8,"./elements/slider":9,"./elements/text":10,"./elements/textfield":11}]},{},[12]);
