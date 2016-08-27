'use strict';


class Container {
  /**
   * Construct a new Container
   * Set the bases for all operations.
   *
   * @param {Phaser.Game} game
   * @param {PIXI.DisplayObject} parent
   */
  constructor(game, parent) {
    this.game = game;
    this.parent = parent;
    this.children = [];
    this.displayGroup = this.game.add.group();

    if(parent) {
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
   * @param {Phaser.Game} game
   * @param {Element} element
   * @return {Element}
   */
  add(game, element) {
    if(!(game instanceof Phaser.Game)) {
      // no game instance, game === element
      element = game;
    }

    element.setContainer(this);

    if(typeof element.init === 'function') {
      // init the element if available
      element.init();
    }

    this.game.world.bringToTop(this.displayGroup);
    this.children.push(element);

    return element;
  }
}

export default Container;
