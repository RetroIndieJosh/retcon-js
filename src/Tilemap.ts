class Tilemap {
        private tile_size: number;

        public pos = Coord.zero();

        protected opaque = true;
        protected wrap = false;

        // width and height of the map in tiles
        private size = Coord.one();

        private surface: Surface;

        private tile_ids: NumberGrid;
        private palette_id: number;

        constructor(tile_size: number, size: Coord, palette_id: number) {
                this.tile_size = tile_size;
                this.size = size;
                this.palette_id = palette_id;

                console.info(`Create tile ${this.size.x}x${this.size.y} tiles of `
                        + `${this.tile_size} pixels squared with palette ${this.palette_id}`);

                this.surface = new Surface(this.size.scale_square(tile_size));

                // TODO a way to set up 2D arrays without needing to write this loop every time
                // TODO Video.get_tile_count for max
                this.tile_ids = new NumberGrid(this.size, 0, 2);
        }

        public blit(target_surface: Surface) {
                this.surface.blit(target_surface, this.pos, this.wrap);
        }

        public get_pixel_height(): number {
                return this.size.y * this.tile_size;
        }

        public get_pixel_size(): Coord {
                return this.size;
        }

        public get_pixel_width(): number {
                return this.size.x * this.tile_size;
        }

        public get_tile_height(): number {
                return this.size.y;
        }

        // number of tiles (x,y) in the TileMap, NOT size of tiles!
        public get_tile_size(): Coord {
                return this.size;
        }

        public get_tile_width(): number {
                return this.size.x;
        }

        public has_tile_coordinate(pos: Coord) {
                return pos.is_in(this.pos, this.size);
        }

        public log() {
                let msg = "";
                let pos = new Coord(0, 0);
                for (; pos.y < this.size.y; pos.y++) {
                        for (pos.x = 0; pos.x < this.size.x; pos.x++) {
                                msg += `${this.tile_ids.get(pos)}`;
                        }
                        msg += "\n";
                }

                console.info(`Tilemap ${this.size.x}x${this.size.y} tiles at ${this.pos.x}, ${this.pos.y}`);
                console.info(msg);
        }

        public randomize() {
                let pos = new Coord(0, 0);
                for (; pos.y < this.size.y; pos.y++) {
                        for (pos.x = 0; pos.x < this.size.x; pos.x++) {
                                // TODO use Video.get_tile_count
                                this.tile_ids.set(pos, Math.floor(Math.random() * 16), false);
                        }
                }
                this.sync_tiles();
        }

        public set_all(tile_id: number) {
                tile_id = Math.floor(tile_id);

                let pos = new Coord(0, 0);
                for (; pos.y < this.size.y; pos.y++) {
                        for (pos.x = 0; pos.x < this.size.x; pos.x++) {
                                this.tile_ids.set(pos, tile_id, false);
                        }
                }

                this.sync_tiles();
        }

        public set_tile(pos: Coord, tile_id: number) {
                pos = pos.floor();

                // TODO warn if tile size mismatches?
                this.tile_ids.set(pos, tile_id, false);
                this.sync_tiles();
        }

        private sync_tiles() {
                if(!Video.is_initialized()) return;

                const palette = Video.get_palette(this.palette_id);
                //console.log(`Tile IDs: ${this.tile_ids}`);
                //console.log(`Video: ${video} / Palette: ${palette} / Size: ${this.width}, ${this.height}`);
                for (let pos = new Coord(0, 0); pos.y < this.size.y; pos.y++) {
                        for (pos.x = 0; pos.x < this.size.x; pos.x++) {
                                const tile = Video.get_tile(this.tile_ids.get(pos));
                                // TODO check for UNCHANGED
                                //console.log(`Tile: ${tile} @ ${x}, ${y}`);
                                // TODO  make sure we don't draw clear (NumberGrid should help?)
                                tile.blit(this.surface, palette, this.pos.scale_square(this.tile_size), this.opaque, this.wrap);
                        }
                }
        }
}