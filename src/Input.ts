class KeyState {
        public is_down: boolean = false;
        public pressed_this_frame: boolean = false;
}

class Input {
        private static is_initialized: boolean = false;
        private static key_states: Map<string, KeyState>;

        public static initialize() {
                if (this.is_initialized) {
                        console.warn("Tried to reinitialize input events");
                        return;
                }

                this.is_initialized = true;

                document.addEventListener('keydown', event => this.on_key_down(event), false);
                document.addEventListener('keyup', event => this.on_key_up(event), false);

                document.addEventListener('keyup', event => {
                }, false);

                this.key_states = new Map<string, KeyState>();
        }

        public static add_key_updater(func: (_: KeyboardEvent) => void ) {
                document.addEventListener('keydown', func);
        }

        public static clear() {
                /*
                console.log("Pressed this frame: ");
                for (const entry of this.key_states.entries()) {
                        if(entry[1].pressed_this_frame)
                                console.log(`=> ${entry[0]}`);
                }
                */

                this.key_states.forEach(key_state => key_state.pressed_this_frame = false);
        }

        public static is_key_down(key_name: string): boolean {
                const state = this.key_states.get(key_name);
                if (state == undefined) return false;
                return state.is_down;
        }

        public static is_key_up(key_name: string): boolean {
                const state = this.key_states.get(key_name);
                if (state == undefined) return false;
                return !state.is_down;
        }

        public static key_pressed_this_frame(key_name: string): boolean {
                const state = this.key_states.get(key_name);
                if (state == undefined) return false;
                return state.pressed_this_frame;
        }

        private static on_key_down(event: KeyboardEvent) {
                const key_name = event.key;

                if (key_name === 'Control') {
                        // do not alert when only Control key is pressed.
                        return;
                }

                if (event.ctrlKey) {
                        // Even though event.key is not 'Control' (e.g., 'a' is pressed),
                        // event.ctrlKey may be true if Ctrl key is pressed at the same time.
                        console.log(`Combination of ctrlKey + ${key_name}`);

                        // TODO
                } else {
                        console.log(`Key pressed ${key_name}`);

                        let state = this.key_states.get(key_name);
                        if (state == undefined) state = new KeyState();
                        state.is_down = true;
                        state.pressed_this_frame = true;
                        this.key_states.set(key_name, state);
                }

        }

        private static on_key_up(event: KeyboardEvent) {
                const key_name = event.key;

                // As the user releases the Ctrl key, the key is no longer active,
                // so event.ctrlKey is false.
                if (key_name === 'Control') {
                        console.log('Control key was released');
                }

                console.log(`Key released ${key_name}`);
                let state = this.key_states.get(key_name);
                if (state == undefined) state = new KeyState();
                state.is_down = false;
                this.key_states.set(key_name, state);
        }
}