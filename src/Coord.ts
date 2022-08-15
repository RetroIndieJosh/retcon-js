class Coord {
        public x: number;
        public y: number;

        //
        // getters
        //

        public static get neg_one() { return new Coord(-1, -1); }
        public static get one() { return new Coord(1, 1); }
        public static get zero() { return new Coord(0, 0); }

        public static get down() { return new Coord(0, 1); }
        public static get left() { return new Coord(-1, 0); }
        public static get right() { return new Coord(1, 0); }
        public static get up() { return new Coord(0, -1); }

        public get ceil() { return new Coord(Math.ceil(this.x), Math.ceil(this.y)); }
        public get floor() { return new Coord(Math.floor(this.x), Math.floor(this.y)); }

        //
        // public static
        //

        // new Coord in range [min, max)
        public static random(min: Coord, max: Coord): Coord {
                return new Coord(Math.random() * max.x + min.x, Math.random() * max.y + min.y)
        }

        //
        // initialization
        //

        constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
        }

        //
        // public
        //

        public add(other_coord: Coord): void {
                this.x += other_coord.x
                this.y += other_coord.y;
        }

        // TODO make this a getter
        public copy(): Coord {
                return new Coord(this.x, this.y);
        }

        public equals(other_coord: Coord): boolean {
                return this.x == other_coord.x && this.y == other_coord.y;
        }

        // includes point at top_left but not point at top_left + size (like array)
        public is_in(start: Coord, size: Coord): boolean {
                let top_left: Coord;
                let bottom_right: Coord;

                // TODO must be a cleaner way to do this
                if (size.x < 0 && size.y > 0) {
                        top_left = new Coord(start.x + size.x, start.y);
                        bottom_right = new Coord(start.x, start.y + size.y);
                } else if (size.x > 0 && size.y < 0) {
                        top_left = new Coord(start.x, start.y + size.y);
                        bottom_right = new Coord(start.x + size.x, start.y);
                } else if (size.x < 0 && size.y < 0) {
                        top_left = start.plus(size);
                        bottom_right = start;
                } else {
                        top_left = start;
                        bottom_right = top_left.plus(size);
                }

                return this.x >= top_left.x
                        && this.y >= top_left.y
                        && this.x < bottom_right.x
                        && this.y < bottom_right.y;
        }

        public minus(other_coord: Coord): Coord {
                return new Coord(this.x - other_coord.x, this.y - other_coord.y);
        }

        public plus(other_coord: Coord): Coord {
                return new Coord(this.x + other_coord.x, this.y + other_coord.y);
        }

        public scale(scale: Coord): void {
                this.x *= scale.x;
                this.y *= scale.y;
        }

        public scale_square(scale: number): void {
                this.x *= scale;
                this.y *= scale;
        }

        public subtract(other_coord: Coord): void {
                this.x -= other_coord.x;
                this.y -= other_coord.y;
        }

        public times(scale: Coord): Coord {
                const new_coord = this.copy();
                new_coord.scale(scale);
                return new_coord;
        }

        public times_square(scale: number): Coord {
                const new_coord = this.copy();
                new_coord.scale_square(scale);
                return new_coord;
        }

        public toString() { return `(${this.x}, ${this.y})`; }
}

function rcj_test_coord() {
        console.debug("Coord Tests Start");

        // TODO make a new grid for each test and use {} to separate

        console.debug("Test Coord: 'constant' coordinates");
        rcj_assert_coord(Coord.zero, 0, 0);
        rcj_assert_coord(Coord.one, 1, 1);
        rcj_assert_coord(Coord.zero.plus(Coord.one), 1, 1);
        rcj_assert_coord(Coord.zero.minus(Coord.one), -1, -1);
        rcj_assert_coord(Coord.left.plus(Coord.right), 0, 0);
        rcj_assert_coord(Coord.up.plus(Coord.down), 0, 0);

        const scale = -3;

        const x = 8;
        const y = 5;
        let pos = new Coord(x, y);

        const x2 = 3;
        const y2 = -17;
        let pos2 = new Coord(x2, y2);

        console.debug("Test Coord: self equality")
        rcj_assert_true(pos.equals(pos));
        rcj_assert_true(pos2.equals(pos2));

        console.debug("Test Coord: set correctly")
        rcj_assert_coord(pos, x, y);
        rcj_assert_coord(pos2, x2, y2);

        console.debug("Test Coord: containment")
        rcj_assert_true(pos.is_in(Coord.zero, new Coord(10, 10)));
        rcj_assert_false(pos.is_in(Coord.zero, pos));
        rcj_assert_true(pos2.is_in(Coord.zero, new Coord(10, -20)));
        rcj_assert_false(pos2.is_in(Coord.zero, pos2));

        console.debug("Test Coord: scaling")
        rcj_assert_true(pos.times(new Coord(scale, scale)).equals(pos.times_square(scale)));
        rcj_assert_coord(pos.times_square(2), x * 2, y * 2);
        rcj_assert_coord(pos2.times_square(2), x2 * 2, y2 * 2);
        rcj_assert_coord(pos.times(pos2), x * x2, y * y2);
        rcj_assert_coord(pos2.times(pos), x * x2, y * y2);

        console.debug("Test Coord: addition")
        rcj_assert_coord(pos.plus(pos2), x + x2, y + y2);
        rcj_assert_coord(pos2.plus(pos), x + x2, y + y2);
        rcj_assert_true(pos.plus(pos2).equals(pos2.plus(pos)));

        console.debug("Test Coord: subtraction")
        rcj_assert_coord(pos.minus(pos2), x - x2, y - y2);
        rcj_assert_coord(pos2.minus(pos), x2 - x, y2 - y);

        // TODO test coord add/subtract
        // TODO test coord scale/scale_square

        console.debug("Coord test complete");
}

function rcj_assert_coord(pos: Coord, x: number, y: number) {
        rcj_assert_equals(x, pos.x);
        rcj_assert_equals(y, pos.y);

}