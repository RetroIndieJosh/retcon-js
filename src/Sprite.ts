class Sprite {
        public x: number = 0;
        public y: number = 0;

        private surface: Surface;

        private palette_id: number;
        private tile: Tile;

        constructor(tile_id: number, palette_id: number) {
                this.tile = Video.get_instance().get_tile(tile_id);
                this.palette_id = palette_id;

                this.surface = new Surface(this.tile.get_width(), this.tile.get_height());
        }

        public draw(target_surface: Surface) {
                this.tile.sync_pixels(this.surface, this.get_palette());
                this.surface.blit(target_surface, this.x, this.y);
        }

        public set_tile(tile_id: number) {
                this.tile = Video.get_instance().get_tile(tile_id);
                this.tile.sync_pixels(this.surface, this.get_palette());
        }

        private get_palette(): Palette {
                return Video.get_instance().get_palette(this.palette_id);
        }
}