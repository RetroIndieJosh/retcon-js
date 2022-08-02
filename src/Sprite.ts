class Sprite extends Tilemap {
        constructor(tile_id: number, palette_id: number) {
                const tile = Video.get_instance().get_tile(tile_id);
                super(tile.get_size(), 1, 1, palette_id);
                
                this.set_tile(0, 0, tile_id);
        }
}