'use strict';

function main() {
  var game = new Phaser.Game(650, 350, Phaser.CANVAS, '', {
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

    game.load.image('menu-button', 'assets/ui/menu.png');
    game.load.image('backdrop', 'assets/backdrop.png');

    sui.load('assets/ui/kenney/kenney.json');
  }

  /**
   * Create
   *
   */
  function create() {
    game.add.sprite(0, -125, 'backdrop');

    // shorten some references
    var easeMode = Phaser.Easing.Exponential.Out;
    // vars later used
    var basePosition;

    // start building the menu
    // order is important, as references (ex. to game) is needed
    // during building elements, so define every element and
    // than later stack them in the right order

    // all texts
    var menuText  = new SLICKUI.Text(game, 10, 0, 'Menu');
    var saveText  = new SLICKUI.Text(game, 0, 0, 'Save Game');
    var closeText = new SLICKUI.Text(game, 0, 0, 'Close');

    // all buttons
    var saveBtn = new SLICKUI.Button(game,
        0, game.height - 166, 140, 80); // x, y, w, h
    var closeBtn = new SLICKUI.Button(game,
        0, game.height - 76, 140, 40); // x, y, w, h
    var menuBtn = new SLICKUI.DisplayObject(game,
        game.width - 45, 8, game.make.sprite(0, 0, 'menu-button'));
        // x, y, dp-obj (w, h)

    // all checkboxes
    var check1 = new SLICKUI.Checkbox(game,
        0, 100, SLICKUI.Checkbox.TYPE_CROSS);
    var check2 = new SLICKUI.Checkbox(game,
        50, 100, SLICKUI.Checkbox.TYPE_CROSS);
    var check3 = new SLICKUI.Checkbox(game,
        100, 100, SLICKUI.Checkbox.TYPE_CHECKBOX);

    // the main PANEL
    var panel = new SLICKUI.Panel(game,
        game.width - 156, 8, 150, game.height - 16);

    // add "root to leafes"
    sui.add(panel);
    sui.add(menuBtn);

    panel.add(menuText);
    panel.add(saveBtn);
    panel.add(closeBtn);
    panel.add(check1);
    panel.add(check2);
    panel.add(check3);

    saveBtn.add(saveText);
    closeBtn.add(closeText);

    // after everything is addded, we can modify and "extend"
    panel.visible = false;
    basePosition = panel.x;

    saveBtn.events.onInputUp.add(function() {
      console.log('Clicked Save Game');
    });

    menuBtn.inputEnabled = true;
    menuBtn.input.useHandCursor = true;
    menuBtn.events.onInputDown.add(function() {
      // on menu button click
      if(panel.visible) {
        return;
      }

      panel.visible = true;
      panel.x = basePosition + 156;

      game.add.tween(panel)
          .to({ x: basePosition }, 500, easeMode, true)
          .onComplete.add(function() {
            menuBtn.visible = false;
          });

      sui.container.displayGroup
                   .bringToTop(panel.container.displayGroup);
    }, this);

    closeBtn.events.onInputDown.add(function() {
      if(!panel.visible) {
        return;
      }

      game.add.tween(panel)
          .to({ x: basePosition + 156 }, 500, easeMode, true)
          .onComplete.add(function() {
            panel.x -= 156;
            panel.visible = false;
            menuBtn.visible = true;
          });
    }, this);

    saveText.center();
    closeText.center();

    function checkboxBehaviour(chk1, chk2) {
      return function() {
        if(chk1.checked && chk2.checked) {
          chk2.checked = false;
        }

        if(!chk1.checked && !chk2.checked) {
          chk1.checked = true;
        }
      }
    }

    check1.events.onInputDown.add(
        checkboxBehaviour(check1, check2), this);

    check2.events.onInputDown.add(
        checkboxBehaviour(check2, check1), this);
  }

  function update() {

  }
}

// run the init in own scope
main();
