class TileManager {
        private static tile_list: Array<Surface> = new Array<Surface>();

        public static add_tile(tile: Surface) {
                TileManager.tile_list.push(tile);
        }

        public static get_tile(index: number) {
                return TileManager.tile_list[index];
        }
}

class TileMap {
        private tile_size: number;

        private x: number = 0;
        private y: number = 0;

        // width and height of the map in tiles
        private width: number;
        private height: number;

        private tile_map: Array<Array<Surface>>;

        constructor(tile_size: number, width: number, height: number) {
                this.tile_size = tile_size;

                this.width = width;
                this.height = height;

                this.tile_map = new Array<Array<Surface>>(width);
                for (let x = 0; x < width; ++x) {
                        this.tile_map[x] = new Array<Surface>(height);
                }
        }

        public get_pixel_height(): number {
                return this.height * this.tile_size;
        }

        public get_pixel_width(): number {
                return this.width * this.tile_size;
        }

        public set_tile(x: number, y: number, index: number) {
                // wrap
                x %= this.width;
                y %= this.height;

                this.tile_map[x][y] = TileManager.get_tile(index);
        }
}