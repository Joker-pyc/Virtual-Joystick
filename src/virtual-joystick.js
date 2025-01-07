class VirtualJoystick {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            width: 100,
            height: 100,
            color: 'gray',
            handleColor: 'white', 
            handleRadius: 20,
            onChange: null,
            onStart: null,
            onEnd: null,
            sensitivity: 1,
            boundaries: false,
            autoCenter: true,
            deadzone: 0.1,
            shape: 'circle',
            mode: 'dynamic',
            lockAxis: null,
            zones: [],
            vibration: true,
            theme: {
                base: {
                    background: 'rgba(128, 128, 128, 0.5)',
                    border: '3px solid rgba(0, 0, 0, 0.8)',
                    shadow: '0 0 10px rgba(0, 0, 0, 0.3)'
                },
                handle: {
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(0, 0, 0, 0.8)',
                    shadow: '0 0 5px rgba(0, 0, 0, 0.5)'
                }
            },
            ...options,
        };

        this.initializeProperties();
        this.createElements();
        this.setupJoystick();
        this.setupEventListeners();
        this.startAnimationLoop();
    }

    initializeProperties() {
        this.position = { x: 0, y: 0 };
        this.delta = { x: 0, y: 0 };
        this.angle = 0;
        this.distance = 0;
        this.isPressed = false;
        this.touchId = null;
        this.initialPosition = { x: 0, y: 0 };
        this.currentZone = null;
    }

    createElements() {
        this.joystick = document.createElement('div');
        this.handle = document.createElement('div');
        this.zones = new Map();
        
        if (this.options.zones.length) {
            this.createZones();
        }
    }

    createZones() {
        this.options.zones.forEach(zone => {
            const zoneElement = document.createElement('div');
            zoneElement.className = 'joystick-zone';
            zoneElement.style.cssText = `
                position: absolute;
                border: 2px dashed ${zone.color || '#ffffff50'};
                border-radius: 50%;
                pointer-events: none;
            `;
            this.zones.set(zone.id, {
                element: zoneElement,
                config: zone
            });
            this.joystick.appendChild(zoneElement);
        });
    }

    setupJoystick() {
        const { width, height, theme, shape } = this.options;
        
        this.joystick.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            border-radius: ${shape === 'circle' ? '50%' : '10px'};
            background: ${theme.base.background};
            border: ${theme.base.border};
            box-shadow: ${theme.base.shadow};
            position: relative;
            touch-action: none;
            user-select: none;
        `;

        this.setupHandle();
        this.container.appendChild(this.joystick);
        this.joystickRect = this.joystick.getBoundingClientRect();
    }

    setupHandle() {
        const { handleRadius, theme } = this.options;
        
        this.handle.style.cssText = `
            width: ${handleRadius * 2}px;
            height: ${handleRadius * 2}px;
            border-radius: 50%;
            background: ${theme.handle.background};
            border: ${theme.handle.border};
            box-shadow: ${theme.handle.shadow};
            position: absolute;
            touch-action: none;
            transition: transform 0.1s ease-out;
            cursor: grab;
        `;

        this.centerHandle();
        this.joystick.appendChild(this.handle);
    }

    centerHandle() {
        const { width, height, handleRadius } = this.options;
        this.handle.style.top = `${(height / 2) - handleRadius}px`;
        this.handle.style.left = `${(width / 2) - handleRadius}px`;
    }

    setupEventListeners() {
        this.handle.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.handle.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        document.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
        window.addEventListener('resize', this._handleResize.bind(this));
        window.addEventListener('orientationchange', this._handleResize.bind(this));
    }

    handleMouseDown(event) {
        if (this.options.mode === 'dynamic') {
            this.initialPosition = {
                x: event.clientX,
                y: event.clientY
            };
        }
        this.isPressed = true;
        this.handle.style.cursor = 'grabbing';
        this.updatePosition(event.clientX, event.clientY);
        this.options.onStart?.();
    }

    handleMouseMove(event) {
        if (this.isPressed) {
            this.updatePosition(event.clientX, event.clientY);
        }
    }

    handleMouseUp() {
        if (this.isPressed) {
            this.isPressed = false;
            this.handle.style.cursor = 'grab';
            if (this.options.autoCenter) {
                this.resetPosition();
            }
            this.options.onEnd?.();
        }
    }

    handleTouchStart(event) {
        event.preventDefault();
        if (this.touchId === null) {
            const touch = event.changedTouches[0];
            this.touchId = touch.identifier;
            
            if (this.options.mode === 'dynamic') {
                this.initialPosition = {
                    x: touch.clientX,
                    y: touch.clientY
                };
            }
            
            this.isPressed = true;
            this.updatePosition(touch.clientX, touch.clientY);
            this.options.onStart?.();
        }
    }

    handleTouchMove(event) {
        event.preventDefault();
        if (this.isPressed) {
            for (let i = 0; i < event.changedTouches.length; i++) {
                const touch = event.changedTouches[i];
                if (touch.identifier === this.touchId) {
                    this.updatePosition(touch.clientX, touch.clientY);
                    break;
                }
            }
        }
    }

    handleTouchEnd(event) {
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (event.changedTouches[i].identifier === this.touchId) {
                this.touchId = null;
                this.isPressed = false;
                if (this.options.autoCenter) {
                    this.resetPosition();
                }
                this.options.onEnd?.();
                break;
            }
        }
    }

    updatePosition(clientX, clientY) {
        const { sensitivity, boundaries, lockAxis, deadzone } = this.options;
        let dx = (clientX - this.joystickRect.left - this.options.width / 2) * sensitivity;
        let dy = (clientY - this.joystickRect.top - this.options.height / 2) * sensitivity;

        if (lockAxis === 'x') dy = 0;
        if (lockAxis === 'y') dx = 0;

        const distance = Math.sqrt(dx * dx + dy * dy);
        this.angle = Math.atan2(dy, dx);
        this.distance = distance;

        if (boundaries) {
            const maxDistance = this.options.handleRadius;
            if (distance > maxDistance) {
                dx = Math.cos(this.angle) * maxDistance;
                dy = Math.sin(this.angle) * maxDistance;
            }
        }

        if (distance < (this.options.handleRadius * deadzone)) {
            dx = 0;
            dy = 0;
        }

        this.position = { x: dx, y: dy };
        this.delta = {
            x: dx / this.options.handleRadius,
            y: dy / this.options.handleRadius
        };

        this.handle.style.transform = `translate(${dx}px, ${dy}px)`;
        this.checkZones();
        this.emitChange();
    }

    checkZones() {
        if (!this.options.zones.length) return;

        const distance = Math.sqrt(this.delta.x ** 2 + this.delta.y ** 2);
        let newZone = null;

        for (const [id, zone] of this.zones) {
            if (distance >= zone.config.min && distance <= zone.config.max) {
                newZone = id;
                break;
            }
        }

        if (this.currentZone !== newZone) {
            this.currentZone = newZone;
            if (newZone && this.options.vibration) {
                navigator.vibrate?.(50);
            }
        }
    }

    emitChange() {
        if (typeof this.options.onChange === 'function') {
            this.options.onChange({
                position: this.position,
                delta: this.delta,
                angle: this.angle,
                distance: this.distance,
                zone: this.currentZone
            });
        }
    }

    _handleResize() {
        this.joystickRect = this.joystick.getBoundingClientRect();
        
        if (this.isPressed) {
            const centerX = this.joystickRect.left + this.options.width / 2;
            const centerY = this.joystickRect.top + this.options.height / 2;
            
            if (this.touchId !== null) {
                const touch = Array.from(event.touches).find(t => t.identifier === this.touchId);
                if (touch) {
                    this.updatePosition(touch.clientX, touch.clientY);
                }
            } else {
                this.updatePosition(
                    centerX + this.position.x,
                    centerY + this.position.y
                );
            }
        } else {
            this.centerHandle();
        }
        
        this.refreshJoystick();
    }

    startAnimationLoop() {
        const animate = () => {
            if (this.isPressed) {
                this.emitChange();
            }
            this.requestId = requestAnimationFrame(animate);
        };
        this.requestId = requestAnimationFrame(animate);
    }

    resetPosition() {
        this.position = { x: 0, y: 0 };
        this.delta = { x: 0, y: 0 };
        this.angle = 0;
        this.distance = 0;
        this.currentZone = null;
        
        this.handle.style.transform = 'translate(0, 0)';
        this.isPressed = false;
        this.touchId = null;
        
        this.emitChange();
    }

    refreshJoystick() {
        const containerRect = this.container.getBoundingClientRect();
        const scale = Math.min(
            containerRect.width / this.options.width,
            containerRect.height / this.options.height
        );
        
        const newWidth = this.options.width * scale;
        const newHeight = this.options.height * scale;
        
        this.joystick.style.width = `${newWidth}px`;
        this.joystick.style.height = `${newHeight}px`;
        
        const handleSize = this.options.handleRadius * 2 * scale;
        this.handle.style.width = `${handleSize}px`;
        this.handle.style.height = `${handleSize}px`;
        
        this.centerHandle();
        this.joystickRect = this.joystick.getBoundingClientRect();
    }

    destroy() {
        this.container.removeChild(this.joystick);
        window.removeEventListener('resize', this._handleResize.bind(this));
        window.removeEventListener('orientationchange', this._handleResize.bind(this));
        cancelAnimationFrame(this.requestId);
    }
}

export default VirtualJoystick;
