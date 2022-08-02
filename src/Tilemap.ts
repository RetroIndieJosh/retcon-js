class Tilemap {
        private tile_size: number;

        public x: number = 0;
        public y: number = 0;

        // width and height of the map in tiles
        private width: number;
        private height: number;

        private surface: Surface;

        private tile_ids: Array<Array<number>>;
        private palette_id: number;

        constructor(tile_size: number, width: number, height: number, palette_id: number) {
                this.tile_size = tile_size;

                this.width = width;
                this.height = height;

                this.palette_id = palette_id;

                this.surface = new Surface(width * tile_size, height * tile_size);

                this.tile_ids = new Array<Array<number>>(width);
                for (let x = 0; x < width; x++) {
                        this.tile_ids[x] = new Array<number>(height);
                        for (let y = 0; y < height; y++)
                                this.tile_ids[x][y] = Math.floor(Math.random() * 16);
                }
                this.sync_tiles();
        }

        public blit(target_surface: Surface) {
                this.surface.blit(target_surface, this.x, this.y);
        }

        public get_pixel_height(): number {
                return this.height * this.tile_size;
        }

        public get_pixel_width(): number {
                return this.width * this.tile_size;
        }

        public set_tile(x: number, y: number, tile_id: number) {
                // wrap
                x %= this.width;
                y %= this.height;

                this.tile_ids[x][y] = tile_id;
                this.sync_tiles();
        }

        private sync_tiles() {
                const video = Video.get_instance();
                const palette = video.get_palette(this.palette_id);
                //console.log(`Tile IDs: ${this.tile_ids}`);
                //console.log(`Video: ${video} / Palette: ${palette} / Size: ${this.width}, ${this.height}`);
                for(let x = 0; x < this.width; x++) {
                        for(let y = 0; y < this.height; y++) {
                                const tile = video.get_tile(this.tile_ids[x][y]);
                                //console.log(`Tile: ${tile} @ ${x}, ${y}`);
                                tile.blit(this.surface, palette, x * this.tile_size, y * this.tile_size);
                        }
                }
        }
}