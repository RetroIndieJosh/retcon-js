// TODO static?
class LowRezJam {
        private static instance: LowRezJam;

        //private doors: Array<Actor>;
        private player: Sprite;
        private tilemap: Tilemap;

        // TODO game path
        public static init(): void {
                retconjs_init(8, "game/lowrezjam.json", () => new LowRezJam());
        }

        constructor() {
                if(LowRezJam.instance != undefined) 
                        throw new Error("Only one game allowed!");

                Input.add_key_updater(this.update);

                this.tilemap = new Tilemap(8, new Coord(8, 8), 0);
                this.tilemap.set_all(0);
                Video.add_background(this.tilemap);

                // initialize objects

                this.player = new Sprite(3, 0, false);
                this.player.pos = new Coord(28, 28);
                Video.add_sprite(this.player);

                /*
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
                */

                /*
                const position = this.get_unoccupied_tile();
                if(position != null) this.player.pos = position;
                */

                // (shouldn't need) initial draw

                /*
                for(let i = 0; i < door_count; i++) {
                        this.doors[i].draw(this.tilemap);
                }
                this.player.draw(this.tilemap);
                */

                LowRezJam.instance = this;
        }

        /*
        private clear_tile(position: Coord) {
                LowRezJam.instance.tilemap.set_tile(position.floor, 0);
        }

        private get_unoccupied_tile(): Coord | null {
                const max_tile_count = this.tilemap.get_tile_width() * this.tilemap.get_pixel_height();
                if(this.doors.length + 1 >= max_tile_count) return null;

                let coord = new Coord(0, 0);
                while(true) {
                        coord.x = Math.random() * this.tilemap.get_tile_width();
                        coord.y = Math.random() * this.tilemap.get_tile_height();
                        if(!this.is_occupied(coord)) return coord.floor;
                }
        }

        private is_occupied(position: Coord) {
                if(this.player.is_at(position)) return true;
                for(let i = 0; i < this.doors.length; i++) {
                        if(this.doors[i].is_at(position)) return true;
                }
        }
        */

        // NOTE: DO NOT USE "this" - IT REFERS TO THE DOCUMENT!!!!!!
        private update(_: KeyboardEvent) {
                const game = LowRezJam.instance;

                //game.clear_tile(game.player.position);

                // TODO send list of door tile positions as "list of solids" to prevent movement into them
                if(Input.key_pressed_this_frame("ArrowLeft") || Input.key_pressed_this_frame("a"))
                        game.player.pos.add(Coord.left);
                else if(Input.key_pressed_this_frame("ArrowRight") || Input.key_pressed_this_frame("d"))
                        game.player.pos.add(Coord.right);

                if(Input.key_pressed_this_frame("ArrowUp") || Input.key_pressed_this_frame("w"))
                        game.player.pos.add(Coord.up);
                else if(Input.key_pressed_this_frame("ArrowDown") || Input.key_pressed_this_frame("s"))
                        game.player.pos.add(Coord.down);

                //game.player.draw(game.tilemap);
        }
}