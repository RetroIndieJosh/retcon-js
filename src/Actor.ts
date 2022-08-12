class Actor extends Sprite {
        private static check_solid: (actor: Actor) => Actor | null;

        protected is_solid = true;

        constructor(tile_id: number, palette_id: number, is_solid = true) {
                super(tile_id, palette_id);

                this.is_solid = is_solid;

                Video.add_sprite(this);
        }

        public static set_check_solid(check_solid: (actor: Actor) => Actor | null) {
                Actor.check_solid = check_solid;
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
                const colliding_actor = Actor.check_solid(this)
                if(colliding_actor != null)  {
                        this.on_collide(colliding_actor);
                        colliding_actor.on_collide(this);
                        this.pos = old_pos;
                        return;
                }
        }

        public update(dt: number) {}

        protected on_collide(other_actor: Actor): void {
                console.debug("on_collide");
        }
}