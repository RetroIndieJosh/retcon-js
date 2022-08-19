class Square {
        private _size = Coord.zero;
        private _top_left = Coord.zero;

        public get size() { return this._size; }
        public get top_left() { return this._top_left; }

        public get bottom_right() { return this.top_left.plus(this.size); }

        constructor(top_left: Coord, size: Coord) {
                this._top_left = top_left;
                this._size = size;
        }
}

abstract class Actor extends Sprite {
        //
        // abstract
        //

        public abstract update(dt: number): void;
        protected abstract on_collide(other_actor: Actor): void;

        //
        // static
        //

        public static set check_solid(value: (actor: Actor, square: Square) => Actor | null) {
                this._check_solid = value;
        }

        private static _check_solid: (actor: Actor, square: Square) => Actor | null;

        //
        // protected
        //

        protected get square() { return new Square(this.pos, this.pixel_size); }

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

        public collides_with(square: Square): boolean {
                if(!this.is_solid) return false;

                const top_left1 = this.pos.floor;
                const bottom_right1 = this.pos.plus(Game.tile_size_coord).floor;
                const top_left2 = square.top_left;
                const bottom_right2 = square.bottom_right;

                return top_left1.x <= bottom_right2.x && bottom_right1.x >= top_left2.x
                        && top_left1.y <= bottom_right2.y && bottom_right1.y >= top_left2.y;
        }

        public move(move: Coord) {
                if(Math.abs(move.x) < Number.EPSILON && Math.abs(move.y) < Number.EPSILON)
                        return;

                var target_square = new Square(this.square.top_left.plus(move), this.pixel_size);

                if(!this.is_solid) return;

                // undo move if solid and hit solid
                const colliding_actor = Actor._check_solid(this, target_square);
                if(colliding_actor == null)
                        this.pos.add(move);
        }
}