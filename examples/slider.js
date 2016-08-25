var game = new Phaser.Game(650, 350, Phaser.CANVAS, '', { preload: preload, create: create });
var slickUI;
function preload() {
    slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
    game.load.image('backdrop', 'assets/backdrop.png');
    slickUI.load('assets/ui/kenney/kenney.json');
}
function create() {
    game.add.sprite(0,-125,'backdrop');
    var panel;
    slickUI.add(panel = new SlickUI.Element.Panel(8, 8, game.width - 16, game.height - 16));
    panel.add(new SlickUI.Element.Text(10,10, "Control the image's opacity by moving the slider")).centerHorizontally().text.alpha = 0.5;

    var previewSprite = game.make.sprite(0,0,'backdrop');
    previewSprite.width *= 0.2;
    previewSprite.height *= 0.2;
    previewSprite.anchor.setTo(0.5);
    panel.add(new SlickUI.Element.DisplayObject(panel.width / 2,panel.height / 2 + 50, previewSprite));

    var valueText = new SlickUI.Element.Text(0,panel.height - 40, '100%');
    var slider = new SlickUI.Element.Slider(16,100, game.width - 64);
    panel.add(slider);
    panel.add(valueText).centerHorizontally();
    slider.onDrag.add(function (value) {
        previewSprite.alpha = value;
        valueText.value = Math.round(value * 100) + '%';
        valueText.centerHorizontally();
    });
    slider.onDragStart.add(function (value) {
        console.log('Start dragging at ' + Math.round(value * 100) + '%');
    });
    slider.onDragStop.add(function (value) {
        console.log('Stop dragging at ' + Math.round(value * 100) + '%');
    });
}
