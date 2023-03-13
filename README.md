# Virtual Joystick

Virtual Joystick is a JavaScript library that allows you to create a joystick control for touch devices.

npm install virtual-joystick
Or include it directly in your HTML file:

```html
<script src="path/to/virtual-joystick.js"></script>
```

Usage
To use Virtual Joystick, create a new instance of the VirtualJoystick class and pass in the container element and options as parameters:

#### const joystick = new VirtualJoystick(container, options);
The container parameter is the HTML element where the joystick control will be placed.

The options parameter is an object containing various configuration options:

#### width: The width of the joystick control in pixels (default: 100).
#### height: The height of the joystick control in pixels (default: 100).
#### color: The background color of the joystick control (default: 'gray').
#### handleColor: The color of the joystick handle (default: 'white').
#### handleRadius: The radius of the joystick handle in pixels (default: 20).
#### onChange: A callback function that will be called when the joystick position changes. The function will receive a delta object with x and y properties representing the position of the joystick handle relative to the center of the joystick control.


Here's an example usage:
## Basic game touch the ball :
https://joker-pyc.github.io/Touch-the-ball/
_________________________________________

```javascript

const container = document.getElementById('joystick-container');
const joystick = new VirtualJoystick(container, {
  width: 150,
  height: 150,
  color: 'gray',
  handleColor: 'black',
  handleRadius: 38,
  onChange: function(delta) {
   //your code... 
    console.log(delta);
  },
});

```


License


Virtual Joystick is released under the MIT License. See the LICENSE file for details
