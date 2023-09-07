/*This Virtual Joystick module is an open source project
you can use it for any purpose as this joystick class is made in JavaScript it works
perfectly in web applications 
Author: Santosh Maurya 
licensed under:
MIT license
*/


  class VirtualJoystick {
            constructor(container, options = {}) {
                this.container = container;
                this.options = Object.assign(
                    {
                        width: 100,
                        height: 100,
                        color: 'gray',
                        handleColor: 'white',
                        handleRadius: 20,
                        onChange: null,
                    },
                    options
                );

                this.joystick = document.createElement('div');
                this.joystick.style.width = `${this.options.width}px`;
                this.joystick.style.height = `${this.options.height}px`;
                this.joystick.style.borderRadius = '50%';
                this.joystick.style.backgroundColor = this.options.color;
                this.joystick.style.position = 'relative';
                this.joystick.style.touchAction = 'none';
                this.joystick.style.border = '3px solid black';
                this.joystick.style.opacity = '50%';
                this.container.appendChild(this.joystick);

                this.handle = document.createElement('div');
                this.handle.style.width = `${this.options.handleRadius * 2}px`;
                this.handle.style.height = `${this.options.handleRadius * 2}px`;
                this.handle.style.borderRadius = '50%';
                this.handle.style.backgroundColor = this.options.handleColor;
                this.handle.style.position = 'absolute';
                this.handle.style.top = `${this.options.height / 2 - this.options.handleRadius}px`;
                this.handle.style.left = `${this.options.width / 2 - this.options.handleRadius}px`;
                this.handle.style.touchAction = 'none';
                this.joystick.appendChild(this.handle);

                this.position = { x: 0, y: 0 };
                this.delta = { x: 0, y: 0 };
                this.handleRadius = this.options.handleRadius;
                this.joystickRect = this.joystick.getBoundingClientRect();

                this.isPressed = false;
                this.touchId = null;

                this._addEventListeners();
            }

            _addEventListeners() {
                this.handle.addEventListener('mousedown', this._handleMouseDown.bind(this));
                document.addEventListener('mousemove', this._handleMouseMove.bind(this));
                document.addEventListener('mouseup', this._handleMouseUp.bind(this));
                this.handle.addEventListener('touchstart', this._handleTouchStart.bind(this));
                document.addEventListener('touchend', this._handleTouchEnd.bind(this));
                document.addEventListener('touchcancel', this._handleTouchEnd.bind(this));
                document.addEventListener('touchmove', this._handleTouchMove.bind(this));
            }

            _handleMouseDown(event) {
                this.isPressed = true;
                this._updatePosition(event.clientX, event.clientY);
            }

            _handleMouseMove(event) {
                if (this.isPressed) {
                    this._updatePosition(event.clientX, event.clientY);
                }
            }

            _handleMouseUp() {
                this.isPressed = false;
                this._resetPosition();
            }

            _handleTouchStart(event) {
                if (this.touchId === null) {
                    this.touchId = event.changedTouches[0].identifier;
                    this.isPressed = true;
                    this._updatePosition(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                }
            }

            _handleTouchEnd(event) {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    if (event.changedTouches[i].identifier === this.touchId) {
                        this.touchId = null;
                        this.isPressed = false;
                        this._resetPosition();
                        break;
                    }
                }
            }

            _handleTouchMove(event) {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    if (event.changedTouches[i].identifier === this.touchId) {
                        this._updatePosition(event.changedTouches[i].clientX, event.changedTouches[i].clientY);
                        break;
                    }
                }
            }

            _updatePosition(x, y) {
                let clientX = x;
                let clientY = y;

                if (this.touchId !== null) {
                    for (let i = 0; i < event.changedTouches.length; i++) {
                        if (event.changedTouches[i].identifier === this.touchId) {
                            clientX = event.changedTouches[i].clientX;
                            clientY = event.changedTouches[i].clientY;
                            const dx = x - this.joystickRect.left - this.options.width / 2 + this.options.handleRadius;
                            const dy = y - this.joystickRect.top - this.options.height / 2 + this.options.handleRadius;

                            break;
                        }
                    }
                }

                const dx = clientX - this.joystickRect.left - this.options.width / 2;
                const dy = clientY - this.joystickRect.top - this.options.height / 2;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > this.handleRadius) {
                    const angle = Math.atan2(dy, dx);
                    this.position = { x: Math.cos(angle) * this.handleRadius, y: Math.sin(angle) * this.handleRadius };
                } else {
                    this.position = { x: dx, y: dy };
                }

                this.delta = { x: this.position.x / this.handleRadius, y: this.position.y / this.handleRadius };

                this.handle.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;

                if (typeof this.options.onChange === 'function') {
                    this.options.onChange(this.delta);
                }
            }

            _resetPosition() {
                this.position = { x: 0, y: 0 };
                this.delta = { x: 0, y: 0 };

                this.handle.style.transform = `translate(0, 0)`;

                if (typeof this.options.onChange === 'function') {
                    this.options.onChange(this.delta);
                }
            }
        }



export default VirtualJoystick;
      
