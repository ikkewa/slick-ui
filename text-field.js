
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

  var textfield;
  /**
   * Create
   *
   */
  function create() {
    game.add.sprite(0, -125, 'backdrop');

    var panel = sui.create('panel',
        8, 8, game.width - 16, game.height - 16);
    var inputText = sui.create('text',
        10, 10, 'Text Input');
    var nameText = sui.create('text',
        12, 34, 'Your Name');

    sui.add(panel);
    panel.add(inputText);
    panel.add(nameText);

    inputText.centerHorizontally()
             .text.alpha = 0.5;

    textfield = sui.create('textfield',
        10, 58, panel.width - 20, 40, 32, 'QWERTZ');

    panel.add(textfield);

    textfield.events.onOK.add(function() {
      alert('Your name is: ' + textfield.value);
    });

    textfield.events.onToggle.add(function(open) {
      console.log('You just ' +
        (open ? 'opened' : 'closed') +
        ' the virtual keyboard'
      );
    });

    textfield.events.onKeyPress.add(function(key) {
      console.log('You pressed: ' + key);
    });
  }

  /**
   * Update
   */
  function update() {
    game.debug.spriteInfo(textfield._sprite, 0, 0);
  }
}


main();
