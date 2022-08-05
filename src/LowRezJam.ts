class Actor {
        // tile position
        public x: number;
        public y: number;
        public tile_id: number;

        constructor(x: number, y: number, tile_id: number) {
                this.x = x;
                this.y = y;
                this.tile_id = tile_id;
        }

        public draw(tilemap: Tilemap): void {
                const x = Math.floor(this.x);
                const y = Math.floor(this.y);
                const tile_id = Math.floor(this.tile_id);

                tilemap.set_tile(x, y, tile_id);
        }

        public move(x_move: number, y_move: number, tilemap: Tilemap) {
                const new_x = this.x + x_move;
                const new_y = this.y + y_move;

                if(!tilemap.has_tile_coordinate(new_x, new_y))
                        return;

                this.x += x_move;
                this.y += y_move;
        }
}

class LowRezJam {
        private static instance: LowRezJam;

        private player: Actor;
        private tilemap: Tilemap;

        public static init(): void {
                retconjs_init(8, "game/lowrezjam.json", () => new LowRezJam());
        }

        constructor() {
                if(LowRezJam.instance != undefined) 
                        throw new Error("Only one game allowed!");

                this.player = new Actor(3, 3, 3);

                Input.add_key_updater(this.update);

                this.tilemap = new Tilemap(8, 8, 8, 1);
                this.tilemap.set_all(0);
                Video.get_instance().add_background(this.tilemap);

                this.player.draw(this.tilemap);

                LowRezJam.instance = this;
        }

        private clear_tile(x: number, y: number) {
                x = Math.floor(x);
                y = Math.floor(y);
                LowRezJam.instance.tilemap.set_tile(x, y, 0);
        }

        // NOTE: DO NOT USE "this" - IT REFERS TO THE DOCUMENT!!!!!!
        private update(_: KeyboardEvent) {
                console.log(`Update ${LowRezJam.instance}: tilemap ${LowRezJam.instance.tilemap}, `
                        + `player at ${LowRezJam.instance.player.x}, ${LowRezJam.instance.player.y}`)

                const game = LowRezJam.instance;

                game.clear_tile(game.player.x, game.player.y);

                if(Input.key_pressed_this_frame("ArrowLeft") || Input.key_pressed_this_frame("a"))
                        game.player.move(-1, 0, game.tilemap);
                else if(Input.key_pressed_this_frame("ArrowRight") || Input.key_pressed_this_frame("d"))
                        game.player.move(1, 0, game.tilemap);

                if(Input.key_pressed_this_frame("ArrowUp") || Input.key_pressed_this_frame("w"))
                        game.player.move(0, -1, game.tilemap);
                else if(Input.key_pressed_this_frame("ArrowDown") || Input.key_pressed_this_frame("s"))
                        game.player.move(0, 1, game.tilemap);

                game.player.draw(game.tilemap);
        }
}