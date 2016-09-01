# SlickUI

SlickUI is a Phaser Plugin to create user interfaces easily.

This is a fork from the original [SlickUI](http://www.slick-ui.com) developed by
Richard Snijders <richard@fizz.nl>. Visit his GitHub at [Flaxis/slick-ui](https://github.com/Flaxis/slick-ui).

### Differences to the original SlickUI Plugin

#### Written with ES6
The original SlickUI is written in ES5 and I just wanted to learn ES6 with a
practical use case. The functionality is the same, but the usage of new language
possibilities is used and gives more comfort during the development.

#### No global `game` instance needed
As the `Phaser.Game` need to be passed to each created element, it removes the need
to have a global `game = new Phaser.Game(..)`. The global `game` is used in the
original plugin, which means a custom, scoped browserify build is a problem and if
the global `game` instance is called `game2` the original plugin will stop working.

At the moment the current `game` instance needs to be passed to each new created element,
but it is on the ToDo list to remove that.

#### Flattened code tree and reduced complexity
With ES6 there are some features that reduces the complexity of code, which is used
where possible (and I am aware of). There are also some parts where Copy&Paste code
parts in some Elements code are removed and put into a base class.

#### TextFields can be used with real Keyboard (+virtual Keyboard)
If textfields are used, a virtual keyboard appears to enter text on mobile and desktop
releases of your game. On Desktop environments it is also possible to use your physical
keyboard and directly start typing. The virtual keyboard is still present.

### Try out some previews

* Menu Example: https://ikkewa.github.io/slick-ui/menu.html
* Slider Example: https://ikkewa.github.io/slick-ui/slider.html
* TextField Example: https://ikkewa.github.io/slick-ui/text-field.html

### Getting started
Install using git:
```sh
git clone https://github.com/ikkewa/slick-ui
```

Note: NPM release not available (yet).

Make sure you have the [Default Kenney theme] in your project assets and ready to load.

Add the following to the bottom of your preload function:
```javascript
// You can use your own methods of making the plugin publicly available.
slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
slickUI.load('assets/ui/kenney/kenney.json'); // Use the path to your kenney.json. This is the file that defines your theme.
```

The Plugin registers itself as `Phaser.Plugins.SlickUI` and from this reference
all elements are available. To reduce code size, the easiest way is:

```javascript
var SLICKUI = Phaser.Plugin.SlickUI;
var mygame = new Phaser.Game(...);
var slickUI = mygame.plugins.add(SLICKUI);
// ...

var button = new SLICKUI.Button(...);
var panel = new SLICKUI.Panel(...);

slickUI.add(panel);
panel.add(button);
```

Since v0.5 it is possible to create elements based on your SlickUI instance
to remove the need to use the `new` keyword:
```javascript
// register plugin
var SLICKUI = Phaser.Plugin.SlickUI;
var mygame = new Phaser.Game(...);
var slickUI = mygame.plugins.add(SLICKUI);

// now use `.create()' instead of `new`
var button = slickUI.create('button', 8, 8, 30, 20);
```

That's it! You're ready to start UI-ing!

### Usage

To start using the UI manager, find a nice spot in your create() function and get started:

#### Adding a panel
**Assuming you're using the variable slickUI for the plugin object**

```javascript
var panel = new SlickUI.Panel(8, 8, 150, game.height - 16);
slickUI.add(panel);
```
This tells the UI manager to add a new panel at X and Y = 8, width of 150 pixels and as high as the game minus 16 pixels.

We can now use the panel's container to add new elements to it.

#### Adding a button
Let's say we wanted to add a button to the panel we just created:
```javascript
var button = new SLICKUI.Button(game, 0, 0, 140, 80);
var text = new SLICKUI.Text(game, 0, 0, 'My Button');
panel.add(button);
button.add(text);

// change something after added
text.center();
button.events.onInputUp.add(function () {console.log('Clicked button');});
```
We now added a button to the panel with the label 'My button'. When we click on it, the console will output 'Clicked Button'.

So what if we wanted to use SlickUI to be a bit more generic? We can also add DisplayObjects to the user interface in the same way.

#### Adding a DisplayObject
We'll assume we have a sprite cached as 'menu-button'
```javascript
var menuButton = new SLICKUI.DisplayObject(game, 8, 8, game.make.sprite(0, 0, 'menu-button'));
slickUI.add(menuButton);
```
That's it! You might be thinking, why would you add a DisplayObject using the UI manager if we can do that just by using phaser's built in tools?

The answer is, because UI elements are cascading and they take care of that themselves by using containers. When adding a Panel, Button or DisplayObject, the UI manager puts it in a container and adds a Phaser group to keep the descending elements organized so you can manipulate entire containers.

#### Adding a Checkbox
Checkboxes can be added using 3 sprites: checkbox, radio and cross. This is how you add a checkbox:
```javascript
var cb = new SLICKUI.Checkbox(game, 0, 10, SLICKUI.Checkbox.TYPE_RADIO);
panel.add(cb);

cb.events.onInputDown.add(function () {
    console.log(cb.checked ? 'Checked' : 'Unchecked');
}, this);
```
If you don't provide a type using the last parameter, the default type will be used. You can choose between the following types:
* SlickUI.Checkbox.TYPE_CHECKBOX (default type, no need to specify)
* SlickUI.Checkbox.TYPE_RADIO
* SlickUI.Checkbox.TYPE_CROSS

#### Adding a Slider
Sliders are used to give the illusion of analog control over an object's property. For example, the game's music volume.
```javascript
var slider = new SLICKUI.Slider(game, 16, 100, panel.width -32);
panel.add(slider);

slider.onDrag.add(function (value) {
    // This will log the slider's value on a scale of 100 every time the user moves the drag handle
    console.log(Math.round(value * 100) + '%');
});
slider.onDragStart.add(function (value) {
    // This will be logged when the user clicks on the drag handle
    console.log('Start dragging at ' + Math.round(value * 100) + '%');
});
slider.onDragStop.add(function (value) {
    // This will be logged when the user releases the drag handle
    console.log('Stop dragging at ' + Math.round(value * 100) + '%');
});
```

#### Adding a text input field

Text input fields are very useful for asking the name of the player. They use canvas embedded virtual keyboards.

```javascript
// The last argument is used to determine the maximum amount of characters the input field can have. Defaults to 32 if kept empty.
var textField = new SlickUI.TextField(game, 10,58, panel.width - 20, 40, 32);
panel.add(textField);

textField.events.onOK.add(function () {
    alert('Your name is: ' + textField.value);
});
textField.events.onToggle.add(function (open) {
    console.log('You just ' + (open ? 'opened' : 'closed') + ' the virtual keyboard');
});
textField.events.onKeyPress.add(function(key) {
    console.log('You pressed: ' + key);
});
```
As you can see, there are three events you can listen to: onOK, onToggle and onKeyPress
* onOK gets dispatched when the user clicks the 'OK' key to confirm their input
* onToggle gets dispatched when the virtual keyboard opens or closes. A boolean parameter is provided telling whether the keyboard is opened (true) or closed (false)
* onKeyPress gets dispatched whenever the user enters a key in the virtual keyboard. Note that the DEL key gets spelled out entirely in when accessing the key in the first parameter.


### Theming

The Design on the canvas is based on one JSON file you provide during setup and loading the Phaser Plugin:

```javascript
slickUI = game.plugins.add(Phaser.Plugin.SlickUI);
slickUI.load('assets/ui/kenney/kenney.json'); // <----
```

The JSON file looks like this:

```json
{
  "name": "<name of the theme>",
  "images": {
    "check_on"         : "<path to image for this>"
    "cross_on"         : "<path to image for this>"
    "radio_on"         : "<path to image for this>"
    "check_off"        : "<path to image for this>"
    "cross_off"        : "<path to image for this>"
    "radio_off"        : "<path to image for this>"
    "button_on"        : "<path to image for this>"
    "button_off"       : "<path to image for this>"
    "text_field"       : "<path to image for this>"
    "slider_end"       : "<path to image for this>"
    "slider_base"      : "<path to image for this>"
    "slider_handle_off": "<path to image for this>"
    "slider_handle_on" : "<path to image for this>"
    "panel"            : "<path to image for this>"
  },
  "fonts": {
    "minecraftia": ["fonts/minecraftia-black.png", "fonts/minecraftia.xml"]
  },
  "button": {
    "border-x": 8,  // border to cut the nine-patch button from
    "border-y": 8
  },
  "text_field": {
    "border-x": 8,
    "border-y": 8
    "kbColors": {
      "bgColor": "#<BG color keyboard panel>",
      "bordColor": "#<border color of Keyboard panel",
      "keyColors": {
        "keyUpBg": "#<BG color of one key>",
        "keyUpBord": "#<Border color of a key>",
        "keyDownBg": "#< BG color of key that is pressed down>",
        "keyDownBord": "#<Border color of key pressed down>"
      }
    }
  },
  "panel": {
    "border-x": 10,
    "border-y": 10
  }
}
```

Panels, Buttons and Textfield are based on so called `nine-patch` images and the
border values in the JSON defines, how many pixels need to be cut off to create
the left/right/top/bottom/... borders.

### TODO List
- [x] Better handling of passing the `game` instance internally (v0.5, done)
- [x] no need to create elements with the `new` keyword (factory) (v0.5, done)
- [] dropdown menus?
- [] optimize build system

### License

The original sources are released with MIT License (see bower.json @flaxis/slick-ui).
Of course this fork is released under the same MIT license.
