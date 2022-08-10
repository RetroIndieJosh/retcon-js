class Sprite extends Tilemap {
        constructor(tile_id: number, palette_id: number, wrap = false) {
                const tile = Video.get_tile(tile_id);
                super(tile.get_size(), Coord.one, palette_id);
                
                // allow transparent pixels
                this.opaque = false;

                this.wrap = wrap;
                this.set_tile(Coord.zero, tile_id);
        }
}

function rcj_test_sprite() {
        console.debug("Sprite tests starting");

        Video.add_tile(new Tile("0123"));

        console.debug("Sprite tests complete");
}