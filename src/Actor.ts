abstract class Actor extends Sprite {
        //
        // abstract
        //

        public abstract update(dt: number): void;
        protected abstract on_collide(other_actor: Actor): void;

        //
        // static
        //

        private static check_solid: (actor: Actor) => Actor | null;

        //
        // protected
        //

        protected is_solid = true;

        //
        // initialization
        //

        constructor(tile_id: number, palette_id: number, is_solid = true) {
                super(tile_id, palette_id);

                this.is_solid = is_solid;

                Video.add_sprite(this);
        }

        //
        // public
        //

        public collides_with(other_actor: Actor): boolean {
                if(!this.is_solid) return false;

                const top_left1 = this.pos.floor;
                const bottom_right1 = this.pos.plus(Video.tile_size_coord).floor;
                const top_left2 = other_actor.pos.floor;
                const bottom_right2 = other_actor.pos.plus(Video.tile_size_coord).floor;

                return top_left1.x <= bottom_right2.x && bottom_right1.x >= top_left2.x
                        && top_left1.y <= bottom_right2.y && bottom_right1.y >= top_left2.y;
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

        // TODO make this a setter? 
        public static set_check_solid(check_solid: (actor: Actor) => Actor | null) {
                Actor.check_solid = check_solid;
        }
}