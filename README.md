# Virtual Joystick

A customizable, touch-friendly virtual joystick implementation for web applications.

![Virtual Joystick Demo](image.png)

## Interactive Demo

Try out the Virtual Joystick right here:

<iframe src="index.html" width="100%" height="400" frameborder="0"></iframe>

*Note: If the demo doesn't appear above, you can view it [here](https://joker-pyc.github.io/Virtual-Joystick/).*

## Description

This Virtual Joystick module is an open-source project that provides a flexible and easy-to-use joystick interface for web applications. It's particularly useful for web-based games, simulations, or any application that requires directional input.

## Features

- 🎮 Customizable appearance (size, colors)
- 🖱️ Support for both mouse and touch events
- ⚡ Real-time position feedback
- 🔌 Easy integration into existing web projects
- 📱 Responsive design

## Installation

To use the Virtual Joystick in your project, follow these steps:

1. Download the `VirtualJoystick.js` file from this repository.
2. Place it in your project directory.
3. Import it into your JavaScript file:

```javascript
import VirtualJoystick from './path/to/VirtualJoystick.js';
```

## Usage

Here's a basic example of how to create and use a Virtual Joystick:

```javascript
// Get the container element where the joystick will be placed
const container = document.getElementById('joystick-container');

// Create a new VirtualJoystick instance
const joystick = new VirtualJoystick(container, {
    width: 150,
    height: 150,
    color: 'lightblue',
    handleColor: 'blue',
    handleRadius: 35,
    onChange: (delta) => {
        console.log(`Joystick position: x=${delta.x}, y=${delta.y}`);
    }
});
```

## Customization

The VirtualJoystick is highly customizable. Here's a visual representation of the available options:

```
┌─────────────────────┐
│         │           │
│   ┌─────┼─────┐     │ ← Joystick base (color)
│   │     │     │     │
│   │  ┌──┴──┐  │     │
│   │  │     │  │     │ ← Handle (handleColor, handleRadius)
│   │  └──┬──┘  │     │
│   │     │     │     │
│   └─────┼─────┘     │
│         │           │
└─────────────────────┘
     ↑         ↑
   width     height
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | number | 100 | Width of the joystick base |
| `height` | number | 100 | Height of the joystick base |
| `color` | string | 'gray' | Background color of the joystick base |
| `handleColor` | string | 'white' | Color of the joystick handle |
| `handleRadius` | number | 20 | Radius of the joystick handle |
| `onChange` | function | null | Callback function that receives the joystick's position |

## Events

The `onChange` callback is triggered whenever the joystick's position changes. It receives a `delta` object with `x` and `y` properties, representing the joystick's position relative to its center. Values range from -1 to 1 for both axes.

```javascript
onChange: (delta) => {
    console.log(`X: ${delta.x.toFixed(2)}, Y: ${delta.y.toFixed(2)}`);
}
```

## License

This project is open-source and available under the MIT License.

## Author

Santosh Maurya

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/virtual-joystick/issues) if you want to contribute.

## Support

If you have any questions or need assistance, please [open an issue](https://github.com/yourusername/virtual-joystick/issues/new) in the project repository.

---

Made with ❤️ by developers, for developers.
