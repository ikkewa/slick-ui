
function main() {
  var game = new Phaser.Game(650, 350, Phaser.CANVAS, 'gamecanvas', {
    preload: preload,
    create: create,
    update: update
  });

  var SLICKUI = Phaser.Plugin.SlickUI;
  var sui;

  /**
   * Preload
   *
   *  - load the Plugin
   *  - load images
   *  - load JSON for Slick-UI
   */
  function preload() {
    sui = game.plugins.add(SLICKUI);

    game.load.image('backdrop', 'assets/backdrop.png');

    sui.load('assets/ui/kenney/kenney.json');
  }

  /**
   * Create
   *
   */
  function create() {
    game.add.sprite(0, -125, 'backdrop');

    var panel = new SLICKUI.Panel(game,
        8, 8, game.width - 16, game.height - 16); // x, y, w, h

    sui.add(panel); // add panel here, as we need panel sizes

    var panelText = new SLICKUI.Text(game,
        10, 10, 'Control the image opacity by moving the slider');

    var valueText = new SLICKUI.Text(game, 0, panel.height - 40, '100%');
    var slider = sui.create('slider', 16, 100, game.width - 64);
    var previewSprite = game.make.sprite(0, 0, 'backdrop');
    var previewSpriteDisplay = new SLICKUI.DisplayObject(game,
        panel.width / 2, panel.height / 2 + 50, previewSprite);

    panel.add(panelText);
    panel.add(previewSpriteDisplay);
    panel.add(slider);
    panel.add(valueText);

    // now ready to enhance and modify

    previewSprite.width *= 0.2;
    previewSprite.height *= 0.2;
    previewSprite.anchor.setTo(0.5);

    panelText.centerHorizontally().text.alpha = 0.5;
    valueText.centerHorizontally();

    slider.onDrag.add(function(val) {
      previewSprite.alpha = val;
      valueText.value = Math.round(val * 100) + '%';
      valueText.centerHorizontally();
    });

    slider.onDragStart.add(function(val) {
      console.log('Start dragging at ' + Math.round(val * 100) + '%');
    });

    slider.onDragStop.add(function(val) {
      console.log('Stop dragging at ' + Math.round(val * 100) + '%');
    });
  }


  /**
   * Update
   */
  function update() {

  }
}


main();
