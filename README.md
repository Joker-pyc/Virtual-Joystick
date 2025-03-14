# Virtual Joystick Library

A lightweight, customizable virtual joystick library for web applications, providing touch and mouse controls for games, simulations, and interactive interfaces.

![Virtual Joystick Demo](https://joker-pyc.github.io/Virtual-Joystick/image.png)

## ✨ Features

-   🎮 **Highly Customizable Appearance:** Size, colors, handle radius, shape (circle or square), and neumorphic styling options.
-   🖱️ **Responsive Input:** Supports both touch and mouse events.
-   ⚡ **Real-time Feedback:** Provides `position`, `delta`, `angle`, `distance`, and active zone information via the `onChange` event.
-   🔄 **Multiple Modes:** Supports `dynamic` (joystick appears where the user touches) and `static` (fixed position) modes.
-   📐 **Axis Locking:**  Option to lock movement to the X or Y axis.
-   🎯 **Customizable Zones:** Define circular zones with `min` and `max` distance thresholds.  The `onChange` event reports the active zone. Optional vibration on zone change (if supported by the browser).
-   🎛️ **Deadzone:** Configurable deadzone to prevent unintended small movements.
-   ↩️ **Auto-Centering:** Option to automatically return the handle to the center when released.
-   🔌 **Easy Integration:** Import the `VirtualJoystick` class and use it in your web project.
-   📱 **Responsive Design:** Adapts to different screen sizes for mobile and desktop.
-   🛠️ **Lifecycle Events:** `onStart` (interaction begins) and `onEnd` (interaction ends) events.
-   💾 **Save/Load:** Ability to save and load joystick configurations.

## Interactive Demo

Try out the Virtual Joystick right here:

<iframe src="https://joker-pyc.github.io/Virtual-Joystick/" width="100%" height="500" frameborder="0"></iframe>

*Note: If the demo doesn't appear above, you can view it [here](https://joker-pyc.github.io/Virtual-Joystick/).*

## Installation

### 1. Add the files to your project:

Download or copy these files into your project:

```
- virtual-joystick.js
- style.css (optional - for demo styling)
```

### 2. Import the library in your JavaScript:

```javascript
import VirtualJoystick from './virtual-joystick.js';
```

## Basic Usage

Creating a simple joystick requires just a container element and a few lines of code:

```javascript
// Get the container element
const container = document.getElementById('joystick-container');

// Create the joystick
const joystick = new VirtualJoystick(container, {
    onChange: (data) => {
        console.log('Position:', data.position);
        console.log('Angle:', data.angle);
        console.log('Distance:', data.distance);
    }
});
```

## Configuration Options

The joystick can be customized with the following options:

| Option        | Type     | Default               | Description                                                                                                                                  |
| :------------ | :------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `width`       | Number   | 150                   | Width of the joystick container in pixels.                                                                                             |
| `height`      | Number   | 150                   | Height of the joystick container in pixels.                                                                                              |
| `handleRadius`| Number   | 30                    | Radius of the joystick handle in pixels.                                                                                                 |
| `color`       | String   | "#808080"             | Base color of the joystick (deprecated, use `theme.base.background`).                                                          |
| `handleColor` | String   | "#ffffff"             | Color of the joystick handle (deprecated, use `theme.handle.background`).                                                                   |
| `sensitivity` | Number   | 1.0                   | Multiplier for joystick movement sensitivity.                                                                                            |
| `deadzone`    | Number   | 0.1                   | Minimal threshold for registering movement (0-1).                                                                                      |
| `boundaries`  | Boolean  | `false`               | Whether to constrain the handle to the container boundaries.                                                                          |
| `autoCenter`  | Boolean  | `true`                | Whether the joystick auto-returns to center when released.                                                                            |
| `shape`       | String   | "circle"              | Shape of the joystick ("circle" or "square").                                                                                           |
| `mode`        | String   | "dynamic"             | Positioning mode ("dynamic" or "static").                                                                                             |
| `lockAxis`    | String   | `null`                | Lock movement to specific axis ("x", "y", or `null`).                                                                                       |
| `vibration`   | Boolean  | `true`                | Enable haptic feedback on supported devices.                                                                                            |
| `zones`       | Array    | `[]`                  | Defined feedback zones (see Zones section).                                                                                              |
| `theme`       | Object   | `{ base: {}, handle: {} }` | Neumorphic theme options. `base`: background, border, shadow. `handle`: background, border, shadow.                                       |
| `onChange`    | Function | `null`                  | Callback function triggered on joystick movement.                                                                                          |
| `onStart`     | Function | `null`                  | Callback function triggered when the user starts interacting with the joystick.                                                             |
| `onEnd`       | Function | `null`                  | Callback function triggered when the user stops interacting with the joystick.                                                             |

## Methods

### `destroy()`
Removes the joystick instance and cleans up event listeners.

```javascript
joystick.destroy();
```

### `update(options)`
Updates the joystick's configuration with new options.

```javascript
joystick.update({
    deadzone: 0.2,
    sensitivity: 1.5
});
```

### `resetPosition()`
Resets the joystick handle to the center position.

```javascript
joystick.resetPosition();
```

## Event Data

The `onChange` callback receives an object with the following properties:

| Property | Type   | Description                                                  |
| :------- | :----- | :----------------------------------------------------------- |
| `position` | Object | Current position of the joystick with `x`, `y` values (absolute within the base) |
| `delta`    | Object | Change in position since last update with `x`, `y` values (normalized, -1 to 1) |
| `angle`    | Number | Current angle in radians (0 to 2π)                          |
| `distance` | Number | Distance from center (0 to 1)                               |
| `zone`     | String | Current active zone ID (if any) or `null`                 |

Example callback usage:

```javascript
const joystick = new VirtualJoystick(container, {
    onChange: (data) => {
        // Access joystick data
        const { position, angle, distance, zone } = data;

        // Use for character movement in a game
        characterSpeed = distance * maxSpeed;
        characterDirection = angle;

        // Apply zone-based effects
        if (zone === 'zone-1') {
            // Apply zone-specific logic
        }
    }
});
```

## Working with Zones

Zones allow you to define specific areas of the joystick with custom colors and behaviors.

### Defining Zones

```javascript
const joystick = new VirtualJoystick(container, {
    zones: [
        {
            id: 'zone-1',
            color: '#4CAF5050', // Includes transparency
            min: 0.0,  // Distance from center (0-1)
            max: 0.3   // Distance from center (0-1)
        },
        {
            id: 'zone-2',
            color: '#FF980050', // Includes transparency
            min: 0.3,
            max: 0.7
        },
        {
            id: 'zone-3',
            color: '#F4433650', // Includes transparency
            min: 0.7,
            max: 1.0
        }
    ]
});
```

When the joystick handle enters a defined zone, the `onChange` callback will provide the zone's ID, allowing you to trigger specific actions or visual feedback.  It is highly recommended to set transparency on Zone colors for visual clarity.

## Mode Types

### Static Mode

In static mode, the joystick base stays fixed at its initial position. The handle can be moved within the constraints of the base.

```javascript
const joystick = new VirtualJoystick(container, {
    mode: 'static'
});
```

### Dynamic Mode

In dynamic mode, the joystick base repositions itself to where the user first touches. This is useful for touchscreen interfaces where the user doesn't need to look at the control.

```javascript
const joystick = new VirtualJoystick(container, {
    mode: 'dynamic'
});
```

## Integration Examples

### Game Character Movement

```javascript
const joystick = new VirtualJoystick(document.getElementById('joystick-container'), {
    onChange: (data) => {
        // Apply movement to character
        character.velocity.x = data.position.x * character.speed;
        character.velocity.y = data.position.y * character.speed;

        // Rotate character based on joystick angle
        if (data.distance > 0.1) {
            character.rotation = data.angle;
        }
    }
});
```

### Camera Control

```javascript
const joystick = new VirtualJoystick(document.getElementById('camera-joystick'), {
    sensitivity: 0.5,
    onChange: (data) => {
        // Pan camera
        camera.position.x += data.delta.x * camera.panSpeed;
        camera.position.y += data.delta.y * camera.panSpeed;

        // Zoom based on distance from center
        if (data.distance > 0.8) {
            camera.zoom -= 0.01;
        } else if (data.distance < 0.2 && data.distance > 0) {
            camera.zoom += 0.01;
        }

        camera.zoom = Math.max(0.5, Math.min(2.0, camera.zoom));
        camera.updateProjectionMatrix();
    }
});
```

## Advanced Usage

### Creating Multiple Joysticks

You can create multiple joysticks for different controls:

```javascript
// Movement joystick (left thumb)
const movementJoystick = new VirtualJoystick(
    document.getElementById('movement-joystick'),
    {
        onChange: handleMovement
    }
);

// Action joystick (right thumb)
const actionJoystick = new VirtualJoystick(
    document.getElementById('action-joystick'),
    {
        onChange: handleAction
    }
);
```

### Saving and Loading Configurations

You can save and load joystick configurations:

```javascript
// Save configuration
function saveJoystickConfig(joystick) {
    const config = joystick.getConfiguration();
    localStorage.setItem('joystickConfig', JSON.stringify(config));
}

// Load configuration
function loadJoystickConfig() {
    const storedConfig = localStorage.getItem('joystickConfig');
    if (storedConfig) {
        const config = JSON.parse(storedConfig);
        return new VirtualJoystick(container, config);
    }
    return new VirtualJoystick(container); // Default configuration
}
```

## Browser Support

The Virtual Joystick library supports all modern browsers including:

- Chrome (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Edge

## Tips and Best Practices

1. **Responsive Design**: Adjust the joystick size based on device screen size for better usability.
2. **Visual Feedback**: Use the zones feature to provide visual feedback on the joystick's state. Consider using transparency on Zone colors for visual clarity.
3. **Performance**: For games, consider using `requestAnimationFrame` rather than reacting to every onChange event.
4. **Accessibility**: Consider providing alternative input methods alongside the joystick.
5. **Testing**: Test on both touch and mouse interfaces to ensure consistent behavior.

## 🎨 Customization Options

The **Virtual Joystick** is highly customizable. Here's a visual representation of the options:

![Joystick Customization Options](cm.png)

## 📝 License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it.

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or create issues for bugs and feature requests.

## 👤 Author

Created by **Santosh Maurya**.
