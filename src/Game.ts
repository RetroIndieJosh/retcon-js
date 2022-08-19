class Game {
        // tiles are tile_size by tile_size pixels
        private static _tile_size = 8;
        public static get tile_size() { return this._tile_size; }
        public static get tile_size_coord() { return new Coord(this._tile_size, this._tile_size); }

        public static initialize(game_data: GameData): void {
                Game._tile_size = game_data.tile_size;

                // load palettes
                game_data.palettes.forEach(palette_data => {
                        const palette = new Palette(palette_data);
                        Video.add_palette(palette);
                });

                // load tiles (TODO from game data)
                game_data.tiles.forEach(tile_data => {
                        const tile = new Tile(tile_data);
                        Video.add_tile(tile);
                });
        }
}