class Coord {
        public x: number = -1;
        public y: number = -1;

        constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
        }
}

class Actor {
        // tile position
        public position: Coord = {x: -1, y: -1};
        public tile_id: number = -1;

        public draw(tilemap: Tilemap): void {
                const x = Math.floor(this.position.x);
                const y = Math.floor(this.position.y);
                const tile_id = Math.floor(this.tile_id);

                if(!tilemap.has_tile_coordinate(x, y))
                        return;

                tilemap.set_tile(x, y, tile_id);
        }

        public is_at(position: Coord) : boolean {
                // TODO do an equals in the class
                return this.position.x == position.x && this.position.y == position.y;
        }

        public move(x_move: number, y_move: number, tilemap: Tilemap) {
                const new_x = this.position.x + x_move;
                const new_y = this.position.y + y_move;

                if(!tilemap.has_tile_coordinate(new_x, new_y))
                        return;

                this.position.x += x_move;
                this.position.y += y_move;
        }
}

class LowRezJam {
        private static instance: LowRezJam;

        private doors: Array<Actor>;
        private player: Actor;
        private tilemap: Tilemap;

        public static init(): void {
                retconjs_init(8, "game/lowrezjam.json", () => new LowRezJam());
        }

        constructor() {
                if(LowRezJam.instance != undefined) 
                        throw new Error("Only one game allowed!");

                Input.add_key_updater(this.update);

                this.tilemap = new Tilemap(8, 8, 8, 1);
                this.tilemap.set_all(0);
                Video.get_instance().add_background(this.tilemap);

                // initialize objects

                this.player = new Actor();

                const door_count = 4;
                this.doors = new Array<Actor>();
                for(let i = 0; i < door_count; i++) {
                        this.doors.push(new Actor());
                }

                // place objects

                for(let i = 0; i < door_count; i++) {
                        let position = this.get_unoccupied_tile();
                        if(position == null) break;

                        this.doors[i].position = position;
                        this.doors[i].tile_id = 1;
                }

                const position = this.get_unoccupied_tile();
                if(position != null) this.player.position = position;

                this.player.tile_id = 3;

                // initial draw

                for(let i = 0; i < door_count; i++) {
                        this.doors[i].draw(this.tilemap);
                }
                this.player.draw(this.tilemap);

                LowRezJam.instance = this;
        }

        private clear_tile(x: number, y: number) {
                x = Math.floor(x);
                y = Math.floor(y);
                LowRezJam.instance.tilemap.set_tile(x, y, 0);
        }

        private get_unoccupied_tile(): Coord | null {
                const max_tile_count = this.tilemap.get_tile_width() * this.tilemap.get_pixel_height();
                if(this.doors.length + 1 >= max_tile_count) return null;

                let coord = new Coord(0, 0);
                while(true) {
                        coord.x = Math.floor(Math.random() * this.tilemap.get_tile_width());
                        coord.y = Math.floor(Math.random() * this.tilemap.get_tile_height());
                        if(!this.is_occupied(coord)) return coord;
                }
        }

        private is_occupied(position: Coord) {
                if(this.player.is_at(position)) return true;
                for(let i = 0; i < this.doors.length; i++) {
                        if(this.doors[i].is_at(position)) return true;
                }
        }

        // NOTE: DO NOT USE "this" - IT REFERS TO THE DOCUMENT!!!!!!
        private update(_: KeyboardEvent) {
                console.log(`Update ${LowRezJam.instance}: tilemap ${LowRezJam.instance.tilemap}, `
                        + `player at ${LowRezJam.instance.player.position.x}, ${LowRezJam.instance.player.position.y}`)

                const game = LowRezJam.instance;

                game.clear_tile(game.player.position.x, game.player.position.y);

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