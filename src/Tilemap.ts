class Tilemap implements Loggable {
        public get marked_for_deletion() { return this._marked_for_deletion; }
        private _marked_for_deletion = false;

        public pos = Coord.zero;

        protected opaque = true;
        protected wrap = false;

        // width and height of the map in tiles
        private size = Coord.one;

        private surface: Surface;

        private tile_ids: NumberGrid;
        private _palette_id: number;

        public get palette_id() { return this._palette_id;}
        public get pixel_height(): number { return this.size.y * Game.tile_size; }
        public get pixel_size(): Coord { return this.size; }
        public get pixel_width(): number { return this.size.x * Game.tile_size; }
        public get tile_height(): number { return this.size.y; }
        public get tile_size(): Coord { return this.size; } // number of tiles (x,y) in the TileMap, NOT size of tiles!
        public get tile_width(): number { return this.size.x; }

        constructor(size: Coord, _palette_id: number) {
                this.size = size.floor;
                this._palette_id = _palette_id;

                console.info(`Create tilemap ${this.size.x}x${this.size.y} tiles of `
                        + `${Game.tile_size} pixels squared with palette ${this._palette_id}`);

                this.surface = new Surface(this.size.times_square(Game.tile_size));
                this.tile_ids = new NumberGrid(this.size, 0, Video.tile_count);
        }

        public blit(target_surface: Surface) {
                this.surface.blit(target_surface, this.pos, this.wrap);
        }

        public destroy(): void {
                this._marked_for_deletion = true;
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
                                this.tile_ids.set(pos, Math.floor(Math.random() * Video.tile_count), false);
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
                pos = pos.floor;

                this.tile_ids.set(pos, tile_id, false);
                this.sync_tiles();
        }

        private sync_tiles() {
                if(!Video.is_initialized) return;

                //console.log(`Tile IDs: ${this.tile_ids}`);
                //console.log(`Video: ${video} / Palette: ${palette} / Size: ${this.width}, ${this.height}`);
                for (let pos = new Coord(0, 0); pos.y < this.size.y; pos.y++) {
                        for (pos.x = 0; pos.x < this.size.x; pos.x++) {
                                const tile = Video.get_tile(this.tile_ids.get(pos));
                                //console.log(`Tile: ${tile} @ ${x}, ${y}`);
                                tile.blit(this.surface, this._palette_id, this.pos.times_square(Game.tile_size), 
                                        this.opaque, this.wrap);
                        }
                }
        }
}

function rcj_test_tilemap() {
        console.debug("TileMap tests starting");

        console.debug("Test TileMap: empty");
        rcj_assert_exception(() => { let fail = new Tile("") });

        console.debug("Test Tile: non-square");
        rcj_assert_exception(() => { let fail = new Tile("12345") });

        // TODO avoid duplication between this and next test
        {
                console.debug("Test Tile: blit matching size (opaque)");

                const tile = new Tile("012345678");
                const palette = new Palette("9012345678");
                const _palette_id = Video.add_palette(palette);

                let surf = new Surface(new Coord(3, 3));
                surf.clear(0);

                tile.blit(surf, _palette_id, Coord.zero, true);
                for (let pos = new Coord(0, 0); pos.y < 3; pos.y++) {
                        for (pos.x = 0; pos.x < 3; pos.x++) {
                                const expected_color = palette.get_color_id(tile.get_pixel(pos));
                                rcj_assert_equals(expected_color, surf.get_pixel(pos));
                        }
                }

                Video.remove_palette_at(_palette_id);
        }

        {
                console.debug("Test Tile: blit matching size (transparent)");

                const tile = new Tile("012345678");
                const palette = new Palette("9012345678");
                const _palette_id = Video.add_palette(palette);

                let surf = new Surface(new Coord(3, 3));
                surf.clear(0);

                tile.blit(surf, _palette_id, Coord.zero, false);
                for (let pos = new Coord(0, 0); pos.y < 3; pos.y++) {
                        for (pos.x = 0; pos.x < 3; pos.x++) {
                                // treat 0th index as clear, so surface will be 0 there
                                const pixel = tile.get_pixel(pos);
                                const expected_color = pixel == 0 ? 0 : palette.get_color_id(tile.get_pixel(pos));
                                rcj_assert_equals(expected_color, surf.get_pixel(pos));
                        }
                }

                Video.remove_palette_at(_palette_id);
        }

        // TODO test set_pixel

        console.debug("Tile tests complete");
}
