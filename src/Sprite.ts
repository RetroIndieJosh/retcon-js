class Sprite extends Tilemap {
        constructor(tile_id: number, palette_id: number) {
                const tile = Video.get_tile(tile_id);
                super(tile.get_size(), Coord.one, palette_id);
                
                // allow transparent pixels
                this.opaque = false;

                // wrap around the target surface
                this.wrap = true;

                this.set_tile(Coord.zero, tile_id);
        }
}