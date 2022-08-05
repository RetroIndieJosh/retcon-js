class LowRezJam {
        private player_x: number;
        private player_y: number;
        private tilemap: Tilemap;

        private static instance: LowRezJam;

        public static init() {
                retconjs_init(8, "game/lowrezjam.json", () => LowRezJam.instance = new LowRezJam());
        }

        constructor() {
                this.player_x = 3;
                this.player_y = 3;

                Input.add_key_updater(this.update);

                this.tilemap = new Tilemap(8, 8, 8, 1);
                this.tilemap.set_all(0);
                Video.get_instance().add_background(this.tilemap);
        }

        private update(_: KeyboardEvent) {
                console.log(`Update ${LowRezJam.instance}: tilemap ${LowRezJam.instance.tilemap}, player at ${LowRezJam.instance.player_x}, ${LowRezJam.instance.player_y}`)

                LowRezJam.instance.tilemap.set_tile(LowRezJam.instance.player_x, LowRezJam.instance.player_y, 0);

                if(Input.key_pressed_this_frame("ArrowLeft") || Input.key_pressed_this_frame("a"))
                        LowRezJam.instance.player_x--;
                else if(Input.key_pressed_this_frame("ArrowRight") || Input.key_pressed_this_frame("d"))
                        LowRezJam.instance.player_x++;

                if(Input.key_pressed_this_frame("ArrowUp") || Input.key_pressed_this_frame("w"))
                        LowRezJam.instance.player_y--;
                else if(Input.key_pressed_this_frame("ArrowDown") || Input.key_pressed_this_frame("s"))
                        LowRezJam.instance.player_y++;

                LowRezJam.instance.tilemap.set_tile(LowRezJam.instance.player_x, LowRezJam.instance.player_y, 3);
        }
}