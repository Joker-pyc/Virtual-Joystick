/*
SCRIPT FOR THE VIRTUAL JOYSTICK THIS IS A USAGE EXAMPLE CODE FOR USAGE OF THE VIRTUAL JOYSTICK LIBRARY 
AUTHOR: joker-pyc
version: 2.0.0
*/

import VirtualJoystick from './src/virtual-joystick.js';

console.log("script Initialized");

let joystick;
let zoneCount = 0;
let currentTheme = localStorage.getItem('theme') || 'light';

function initializeJoystick(options) {
    const container = document.getElementById('joystick-container');
    if (!container) return;

    // Clear the container first
    container.innerHTML = '';
    
    if (joystick) joystick.destroy();

    // Create the joystick with the container element
    joystick = new VirtualJoystick(container, {
        ...options,
        onChange: updateJoystickValues
    });

    // Ensure the container is visible
    container.style.display = 'block';
    container.style.position = 'relative';
    container.style.width = `${options.width}px`;
    container.style.height = `${options.height}px`;
}

function updateJoystickValues(data) {
    document.getElementById('positionX').textContent = data.position.x.toFixed(2);
    document.getElementById('positionY').textContent = data.position.y.toFixed(2);
    document.getElementById('deltaX').textContent = data.delta.x.toFixed(2);
    document.getElementById('deltaY').textContent = data.delta.y.toFixed(2);
    document.getElementById('angle').textContent = (data.angle * (180 / Math.PI)).toFixed(2);
    document.getElementById('distance').textContent = data.distance.toFixed(2);
    document.getElementById('currentZone').textContent = data.zone || 'None';
}

function addZone() {
    zoneCount++;
    const zoneId = `zone-${zoneCount}`;
    const zoneSettings = document.getElementById('zone-settings');
    const zoneSetting = document.createElement('div');
    zoneSetting.className = 'zone-setting';
    zoneSetting.id = `${zoneId}-setting`;

    zoneSetting.innerHTML = `
        <h4>Zone ${zoneCount}</h4>
        <div class="control-group">
            <label for="${zoneId}-color">Color:</label>
            <div class="color-picker-container">
                <input type="color" id="${zoneId}-color" value="#4CAF50">
                <input type="text" id="${zoneId}-color-text" value="#4CAF50" class="color-text">
            </div>
        </div>
        <div class="control-group">
            <label for="${zoneId}-min">Min Distance:</label>
            <div class="slider-container">
                <input type="range" id="${zoneId}-min-slider" min="0" max="1" value="0.2" step="0.05" class="slider">
                <input type="number" id="${zoneId}-min" value="0.2" min="0" max="1" step="0.05">
            </div>
        </div>
        <div class="control-group">
            <label for="${zoneId}-max">Max Distance:</label>
            <div class="slider-container">
                <input type="range" id="${zoneId}-max-slider" min="0" max="1" value="0.5" step="0.05" class="slider">
                <input type="number" id="${zoneId}-max" value="0.5" min="0" max="1" step="0.05">
            </div>
        </div>
        <button class="btn-secondary zone-remove-btn" data-zone-id="${zoneId}">
            <i class="fas fa-trash"></i> Remove
        </button>
    `;

    zoneSettings.appendChild(zoneSetting);
    attachZoneEventListeners(zoneSetting);
    updateJoystickFromPanel();
}

function attachZoneEventListeners(zoneSetting) {
    zoneSetting.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', updateJoystickFromPanel);
        if (input.type === 'range') {
            const inputId = input.id.replace('-slider', '');
            const numberInput = document.getElementById(inputId);
            input.addEventListener('input', () => numberInput.value = input.value);
            numberInput.addEventListener('change', () => input.value = numberInput.value);
        }
        if (input.type === 'color') {
            const textInput = document.getElementById(`${input.id}-text`);
            input.addEventListener('input', () => textInput.value = input.value);
            textInput.addEventListener('change', () => input.value = textInput.value);
        }
    });
    const removeBtn = zoneSetting.querySelector('.zone-remove-btn');
    removeBtn.addEventListener('click', () => removeZone(removeBtn.getAttribute('data-zone-id')));
}

function removeZone(zoneId) {
    const zoneSetting = document.getElementById(`${zoneId}-setting`);
    if (zoneSetting) {
        zoneSetting.remove();
        updateJoystickFromPanel();
    }
}

function getZonesFromPanel() {
    const zones = [];
    document.querySelectorAll('.zone-setting').forEach(zoneSetting => {
        const zoneId = zoneSetting.id.replace('-setting', '');
        const colorInput = document.getElementById(`${zoneId}-color`);
        const minInput = document.getElementById(`${zoneId}-min`);
        const maxInput = document.getElementById(`${zoneId}-max`);

        zones.push({
            id: zoneId,
            color: colorInput.value,
            min: parseFloat(minInput.value),
            max: parseFloat(maxInput.value)
        });
    });
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

function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
    currentTheme = themeName;
}

function toggleTheme() {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}

function setupThemeToggle() {
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = currentTheme === 'dark';
        applyTheme(currentTheme);
        themeSwitch.addEventListener('change', toggleTheme);
    }
}

function setupTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) tabContent.classList.add('active');
        });
    });
}

function setupSliders() {
    const sliderGroups = [
        { slider: 'width-slider', input: 'width' },
        { slider: 'height-slider', input: 'height' },
        { slider: 'handleRadius-slider', input: 'handleRadius' },
        { slider: 'sensitivity-slider', input: 'sensitivity' },
        { slider: 'deadzone-slider', input: 'deadzone' }
    ];

    sliderGroups.forEach(group => {
        const slider = document.getElementById(group.slider);
        const numberInput = document.getElementById(group.input);

        slider.addEventListener('input', () => {
            numberInput.value = slider.value;
            updateJoystickFromPanel();
        });
        numberInput.addEventListener('change', () => {
            slider.value = numberInput.value;
            updateJoystickFromPanel();
        });
    });
}

function setupColorPickers() {
    const colorGroups = [
        { picker: 'color', text: 'color-text' },
        { picker: 'handleColor', text: 'handleColor-text' }
    ];

    colorGroups.forEach(group => {
        const colorPicker = document.getElementById(group.picker);
        const textColorInput = document.getElementById(group.text);

        colorPicker.addEventListener('input', () => {
            textColorInput.value = colorPicker.value;
            updateJoystickFromPanel();
        });
        textColorInput.addEventListener('input', () => {
            colorPicker.value = textColorInput.value;
            updateJoystickFromPanel();
        });
    });
}

function showToast(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function saveConfiguration() {
    const config = {
        width: document.getElementById('width').value,
        height: document.getElementById('height').value,
        handleRadius: document.getElementById('handleRadius').value,
        color: document.getElementById('color').value,
        handleColor: document.getElementById('handleColor').value,
        sensitivity: document.getElementById('sensitivity').value,
        deadzone: document.getElementById('deadzone').value,
        boundaries: document.getElementById('boundaries').checked,
        autoCenter: document.getElementById('autoCenter').checked,
        shape: document.getElementById('shape').value,
        mode: document.getElementById('mode').value,
        lockAxis: document.getElementById('lockAxis').value,
        vibration: document.getElementById('vibration').checked,
        zones: getZonesFromPanel()
    };

    localStorage.setItem('joystickConfig', JSON.stringify(config));
    showToast('Configuration saved successfully!', 'success');
}

function resetConfiguration() {
    localStorage.removeItem('joystickConfig');
    loadDefaultConfiguration();
    showToast('Configuration reset to defaults', 'info');
}

function loadConfiguration() {
    const storedConfig = localStorage.getItem('joystickConfig');
    if (storedConfig) {
        try {
            const config = JSON.parse(storedConfig);
            applyConfiguration(config);
            showToast('Saved configuration loaded', 'info');
        } catch (error) {
            console.error('Error loading saved configuration:', error);
            loadDefaultConfiguration();
        }
    } else {
        loadDefaultConfiguration();
    }
}

function loadDefaultConfiguration() {
    const defaultConfig = {
        width: 150,
        height: 150,
        handleRadius: 30,
        color: '#808080',
        handleColor: '#ffffff',
        sensitivity: 1,
        deadzone: 0.1,
        boundaries: false,
        autoCenter: true,
        shape: 'circle',
        mode: 'dynamic',
        lockAxis: '',
        vibration: true,
        zones: []
    };
    applyConfiguration(defaultConfig);
}

function applyConfiguration(config) {
    setValueWithSlider('width', config.width);
    setValueWithSlider('height', config.height);
    setValueWithSlider('handleRadius', config.handleRadius);
    document.getElementById('color').value = config.color;
    document.getElementById('color-text').value = config.color;
    document.getElementById('handleColor').value = config.handleColor;
    document.getElementById('handleColor-text').value = config.handleColor;
    setValueWithSlider('sensitivity', config.sensitivity);
    setValueWithSlider('deadzone', config.deadzone);
    document.getElementById('boundaries').checked = config.boundaries;
    document.getElementById('autoCenter').checked = config.autoCenter;
    document.getElementById('shape').value = config.shape;
    document.getElementById('mode').value = config.mode;
    document.getElementById('lockAxis').value = config.lockAxis || '';
    document.getElementById('vibration').checked = config.vibration;

    const zoneSettings = document.getElementById('zone-settings');
    zoneSettings.innerHTML = '';
    zoneCount = 0;
    
    if (config.zones && Array.isArray(config.zones)) {
        config.zones.forEach(zone => {
            addZone();
            const zoneId = `zone-${zoneCount}`;
            document.getElementById(`${zoneId}-color`).value = zone.color;
            document.getElementById(`${zoneId}-color-text`).value = zone.color;
            setValueWithSlider(`${zoneId}-min`, zone.min);
            setValueWithSlider(`${zoneId}-max`, zone.max);
        });
    }

    updateJoystickFromPanel();
}

function setValueWithSlider(inputId, value) {
    const input = document.getElementById(inputId);
    const slider = document.getElementById(`${inputId}-slider`);
    if (input) input.value = value;
    if (slider) slider.value = value;
}

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupTabs();
    setupSliders();
    setupColorPickers();

    document.getElementById('addZone').addEventListener('click', addZone);
    document.getElementById('save-config').addEventListener('click', saveConfiguration);
    document.getElementById('reset-config').addEventListener('click', resetConfiguration);

    const selectInputs = document.querySelectorAll('select');
    selectInputs.forEach(select => {
        select.addEventListener('change', updateJoystickFromPanel);
    });

    const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
    checkboxInputs.forEach(checkbox => {
        checkbox.addEventListener('change', updateJoystickFromPanel);
    });

    loadConfiguration();
});
