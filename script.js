import VirtualJoystick from './src/virtual-joystick.js'; // Import your joystick class

let joystick; // Keep joystick instance global for updates
let zoneCount = 0;

function initializeJoystick(options) {
    const container = document.getElementById('joystick-container');
    if (joystick) {
        joystick.destroy();
    }

    joystick = new VirtualJoystick(container, {
        ...options,
        onChange: updateJoystickValues
    });
}

function updateJoystickValues(data) {
    document.getElementById('positionX').value = data.position.x.toFixed(2);
    document.getElementById('positionY').value = data.position.y.toFixed(2);
    document.getElementById('deltaX').value = data.delta.x.toFixed(2);
    document.getElementById('deltaY').value = data.delta.y.toFixed(2);
    document.getElementById('angle').value = (data.angle * (180 / Math.PI)).toFixed(2);
    document.getElementById('distance').value = data.distance.toFixed(2);
    document.getElementById('currentZone').value = data.zone || 'None';
}

function addZone() {
    zoneCount++;
    const zoneId = `zone-${zoneCount}`;
    const zoneSettings = document.getElementById('zone-settings');
    const zoneSetting = document.createElement('div');
    zoneSetting.className = 'zone-setting';
    zoneSetting.id = `${zoneId}-setting`;
    zoneSetting.innerHTML = `
        <h3>Zone ${zoneCount}</h3>
        <div class="control-group">
            <label for="${zoneId}-color">Color:</label>
            <input type="color" id="${zoneId}-color" value="#ffffff">
        </div>
        <div class="control-group">
            <label for="${zoneId}-min">Min:</label>
            <input type="number" id="${zoneId}-min" value="0" min="0" max="1" step="0.05">
        </div>
        <div class="control-group">
            <label for="${zoneId}-max">Max:</label>
            <input type="number" id="${zoneId}-max" value="0.5" min="0" max="1" step="0.05">
        </div>
        <button onclick="removeZone('${zoneId}')">Remove</button>
    `;
    zoneSettings.appendChild(zoneSetting);
}

window.removeZone = function(zoneId) {
    document.getElementById(`${zoneId}-setting`).remove();
    updateJoystickFromPanel();
};

function getZonesFromPanel() {
    const zones = [];
    for (let i = 1; i <= zoneCount; i++) {
        const zoneId = `zone-${i}`;
        const zoneSetting = document.getElementById(`${zoneId}-setting`);
        if (zoneSetting) {
            zones.push({
                id: zoneId,
                color: document.getElementById(`${zoneId}-color`).value,
                min: parseFloat(document.getElementById(`${zoneId}-min`).value),
                max: parseFloat(document.getElementById(`${zoneId}-max`).value)
            });
        }
    }
    return zones;
}

function updateJoystickFromPanel() {
    const options = {
        width: parseInt(document.getElementById('width').value),
        height: parseInt(document.getElementById('height').value),
        handleRadius: parseInt(document.getElementById('handleRadius').value),
        color: document.getElementById('color').value,
        handleColor: document.getElementById('handleColor').value,
        sensitivity: parseFloat(document.getElementById('sensitivity').value),
        deadzone: parseFloat(document.getElementById('deadzone').value),
        boundaries: document.getElementById('boundaries').checked,
        autoCenter: document.getElementById('autoCenter').checked,
        shape: document.getElementById('shape').value,
        mode: document.getElementById('mode').value,
        lockAxis: document.getElementById('lockAxis').value || null,
        vibration: document.getElementById('vibration').checked,
        zones: getZonesFromPanel()
    };
    initializeJoystick(options);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeJoystick({});

    // Event listeners for all controls
    document.querySelectorAll('.panel input, .panel select, .panel button').forEach(element => {
        if (element.id !== 'addZone') {
            element.addEventListener('change', updateJoystickFromPanel);
        }
    });

    document.getElementById('addZone').addEventListener('click', addZone);
});