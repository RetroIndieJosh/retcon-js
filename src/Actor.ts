class Actor extends Sprite {
        private is_solid = true;
        private check_solid: (actor: Actor) => boolean;

        constructor(tile_id: number, palette_id: number, check_solid: (actor: Actor) => boolean, is_solid = true) {
                super(tile_id, palette_id);

                this.check_solid = check_solid;
                this.is_solid = is_solid;

                Video.add_sprite(this);
        }

        public collides_with(other_actor: Actor): boolean {
                const amin = this.pos.floor;
                const amax = this.pos.plus(Video.tile_size_coord).floor;
                const bmin = other_actor.pos.floor;
                const bmax = other_actor.pos.plus(Video.tile_size_coord).floor;

                //console.debug(`(${amin} to ${amax} vs ${bmin} to ${bmax})`);

                // AABB
                // return (a.minX <= b.maxX && a.maxX >= b.minX) &&
                        // (a.minY <= b.maxY && a.maxY >= b.minY) &&
                return amin.x <= bmax.x && amax.x >= bmin.x
                        && amin.y <= bmax.y && amax.y >= bmin.y;
        }

        public move(move: Coord) {
                if(Math.abs(move.x) < Number.EPSILON && Math.abs(move.y) < Number.EPSILON)
                        return;

                const old_pos = this.pos.copy();
                this.pos.add(move);

                if(!this.is_solid) return;

                // undo move if solid and hit solid
                if(this.check_solid(this))  {
                        this.pos = old_pos;
                        return;
                }
        }
}