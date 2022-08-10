class Coord {
        public x: number;
        public y: number;

        public static neg_one() { return new Coord(-1, -1); }
        public static one() { return new Coord(1, 1); }
        public static zero() { return new Coord(0, 0); }

        public static down() { return new Coord(0, 1); }
        public static left() { return new Coord(-1, 0); }
        public static right() { return new Coord(1, 0); }
        public static up() { return new Coord(0, -1); }

        // new Coord in range [min, max)
        public static random(min: Coord, max: Coord): Coord {
                return new Coord(Math.random() * max.x + min.x, Math.random() * max.y + min.y)
        }

        constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
        }

        public add(other_coord: Coord): Coord {
                return new Coord(this.x + other_coord.x, this.y + other_coord.y);
        }

        public equals(other_coord: Coord): boolean {
                return this.x == other_coord.x && this.y == other_coord.y;
        }

        public floor(): Coord {
                return new Coord(Math.floor(this.x), Math.floor(this.y));
        }

        // includes point at top_left but not point at top_left + size (like array)
        public is_in(start: Coord, size: Coord): boolean {
                let top_left: Coord;
                let bottom_right: Coord;

                if (size.x < 0 && size.y > 0) {
                        top_left = new Coord(start.x + size.x, start.y);
                        bottom_right = new Coord(start.x, start.y + size.y);
                } else if (size.x > 0 && size.y < 0) {
                        top_left = new Coord(start.x, start.y + size.y);
                        bottom_right = new Coord(start.x + size.x, start.y);
                } else if (size.x < 0 && size.y < 0) {
                        top_left = start.add(size);
                        bottom_right = start;
                } else {
                        top_left = start;
                        bottom_right = top_left.add(size);
                }

                return this.x >= top_left.x
                        && this.y >= top_left.y
                        && this.x < bottom_right.x
                        && this.y < bottom_right.y;
        }

        public scale(scale: Coord): Coord {
                return new Coord(this.x * scale.x, this.y * scale.y);
        }

        public scale_square(scale: number): Coord {
                return new Coord(this.x * scale, this.y * scale);
        }

        public subtract(other_coord: Coord): Coord {
                let x = this.x - other_coord.x;
                let y = this.y - other_coord.y;
                return new Coord(x, y);
        }
}

function rcj_test_coords() {
        console.debug("Test Coord: 'constant' coordinates");
        rcj_test_coord(Coord.zero(), 0, 0);
        rcj_test_coord(Coord.one(), 1, 1);
        rcj_test_coord(Coord.zero().add(Coord.one()), 1, 1);
        rcj_test_coord(Coord.zero().subtract(Coord.one()), -1, -1);
        rcj_test_coord(Coord.left().add(Coord.right()), 0, 0);
        rcj_test_coord(Coord.up().add(Coord.down()), 0, 0);

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
        rcj_test_coord(pos, x, y);
        rcj_test_coord(pos2, x2, y2);

        console.debug("Test Coord: containment")
        rcj_assert_true(pos.is_in(Coord.zero(), new Coord(10, 10)));
        rcj_assert_false(pos.is_in(Coord.zero(), pos));
        rcj_assert_true(pos2.is_in(Coord.zero(), new Coord(10, -20)));
        rcj_assert_false(pos2.is_in(Coord.zero(), pos2));

        console.debug("Test Coord: scaling")
        rcj_assert_true(pos.scale(new Coord(scale, scale)).equals(pos.scale_square(scale)));
        rcj_test_coord(pos.scale_square(2), x * 2, y * 2);
        rcj_test_coord(pos2.scale_square(2), x2 * 2, y2 * 2);
        rcj_test_coord(pos.scale(pos2), x * x2, y * y2);
        rcj_test_coord(pos2.scale(pos), x * x2, y * y2);

        console.debug("Test Coord: addition")
        rcj_test_coord(pos.add(pos2), x + x2, y + y2);
        rcj_test_coord(pos2.add(pos), x + x2, y + y2);
        rcj_assert_true(pos.add(pos2).equals(pos2.add(pos)));

        console.debug("Test Coord: subtraction")
        rcj_test_coord(pos.subtract(pos2), x - x2, y - y2);
        rcj_test_coord(pos2.subtract(pos), x2 - x, y2 - y);

        console.debug("Coord test complete");
}

function rcj_test_coord(pos: Coord, x: number, y: number): number {
        let fail_count = 0;
        if (!rcj_assert_equals(x, pos.x)) fail_count++;
        if (!rcj_assert_equals(y, pos.y)) fail_count++;
        return fail_count;
}