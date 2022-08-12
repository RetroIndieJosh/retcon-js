// tilemap with movement and collision
class Colllider {
        // tile position
        public position: Coord = new Coord(-1, -1);
        public tile_id: number = -1;

        public is_at(position: Coord) : boolean {
                return this.position.floor.equals(position.floor);
        }

        public move(move: Coord, tilemap: Tilemap, collide = true) {
                // TODO check collision

                const new_position = this.position.add(move);

                if(!tilemap.has_tile_coordinate(new_position))
                        return;

                this.position = this.position.add(move);
        }
}
