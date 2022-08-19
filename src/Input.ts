class KeyState {
        public is_down: boolean = false;
        public pressed_this_frame: boolean = false;

        constructor(is_down: boolean, pressed_this_frame: boolean) {
                this.is_down = is_down;
                this.pressed_this_frame = pressed_this_frame;
        }
}

class Input {
        private static is_initialized: boolean = false;
        private static key_states: Map<string, KeyState>;

        public static initialize() {
                if (this.is_initialized) {
                        console.warn("Tried to reinitialize input events");
                        return;
                }

                this.key_states = new Map<string, KeyState>();

                document.addEventListener('keydown', event => this.on_key_down(event), false);
                document.addEventListener('keyup', event => this.on_key_up(event), false);

                Video.add_frame_event(this.clear);

                this.is_initialized = true;
        }

        public static add_key_updater(func: (_: KeyboardEvent) => void ) {
                document.addEventListener('keydown', func);
        }

        // clear every frame
        public static clear(dt: number) {
                Input.key_states.forEach(key_state => key_state.pressed_this_frame = false);
        }

        public static is_key_down(key_name: string): boolean {
                const state = this.key_states.get(key_name.toLowerCase());
                if (state == undefined) return false;
                return state.is_down;
        }

        public static is_key_up(key_name: string): boolean {
                const state = this.key_states.get(key_name.toLowerCase());
                if (state == undefined) return false;
                return !state.is_down;
        }

        public static key_pressed_this_frame(key_name: string): boolean {
                const state = this.key_states.get(key_name.toLowerCase());
                if (state == undefined) return false;
                return state.pressed_this_frame;
        }

        private static on_key_down(event: KeyboardEvent) {
                const key_name = event.key.toLowerCase();

                if (key_name === 'Control') {
                        // do not alert when only Control key is pressed.
                        return;
                }

                let msg = "";

                if (event.altKey) {
                        this.set_key_state("alt", true, true);
                        msg += "alt+";
                }

                if (event.ctrlKey) {
                        this.set_key_state("ctrl", true, true);
                        msg += "ctrl+";
                }

                if (event.shiftKey) {
                        this.set_key_state("shift", true, true);
                        console.debug("=> with Shift");
                        msg += "shift+";
                }

                this.set_key_state(key_name, true, true);
                console.debug(`${msg}${key_name} pressed`);
        }

        private static set_key_state(key_name: string, is_down: boolean, pressed_this_frame: boolean) {
                let state = this.key_states.get(key_name.toLowerCase());
                if (state == undefined)
                        state = new KeyState(true, true);

                state.is_down = is_down;
                state.pressed_this_frame = pressed_this_frame;

                this.key_states.set(key_name, state);
        }

        private static on_key_up(event: KeyboardEvent) {
                const key_name = event.key.toLowerCase();

                // As the user releases the Ctrl key, the key is no longer active,
                // so event.ctrlKey is false.
                if (key_name === 'Control') {
                        console.debug('Control key was released');
                }

                console.debug(`Key released ${key_name}`);
                this.set_key_state(key_name, false, false);
        }
}