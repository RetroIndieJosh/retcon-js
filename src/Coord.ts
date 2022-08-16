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
        public get swap() { return new Coord(Math.floor(this.y), Math.floor(this.x)); }

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
                const new_coord = this.copy();
                new_coord.subtract(other_coord);
                return new_coord;
        }

        public plus(other_coord: Coord): Coord {
                const new_coord = this.copy();
                new_coord.add(other_coord);
                return new_coord;
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

abstract class Test {
        protected abstract initialize(): void;
        public abstract run(): void;
}

class CoordTest extends Test {
        private test_pos: Coord;
        private test_pos2: Coord;

        constructor() {
                super();
                this.test_pos = new Coord(8, 5);
                this.test_pos2 = new Coord(8, 5);
        }

        protected initialize(): void {
                this.test_pos = new Coord(8, 5);
                this.test_pos2 = new Coord(8, 5);
        }

        public run(): void {
                console.debug("Coord Tests Start");

                this.test_equals();

                this.test_plus();
                this.test_add();
                this.test_constants(); // uses add to check left+right, up+down

                this.test_minus();
                this.test_subtract();

                this.test_times();
                this.test_times_square();
                this.test_scale();
                this.test_scale_square();

                this.test_is_in();

                console.debug("Coord test complete");
        }

        private test_add() {
                console.debug("Test Coord: add")

                this.initialize();

                this.test_pos2.x += 12;
                this.test_pos2.y += -7;

                this.test_pos.add(new Coord(12, -7));

                rcj_assert_coord(this.test_pos, this.test_pos2);
        }

        private test_constants() {
                console.debug("Test Coord: 'constant' coordinates");

                rcj_assert_coord(Coord.zero, new Coord(0, 0));
                rcj_assert_coord(Coord.one, new Coord(1, 1));
                rcj_assert_coord(Coord.neg_one, new Coord(-1, -1));

                rcj_assert_coord(Coord.left.plus(Coord.right), Coord.zero);
                rcj_assert_coord(Coord.up.plus(Coord.down), Coord.zero);
        }

        private test_equals() {
                console.debug("Test Coord: equals")

                this.initialize();

                rcj_assert_true(this.test_pos.equals(this.test_pos));

        }

        private test_is_in() {
                console.debug("Test Coord: is_in")

                this.initialize();

                rcj_assert_true(this.test_pos.is_in(Coord.zero, new Coord(10, 10)));
                rcj_assert_false(this.test_pos.is_in(Coord.zero, this.test_pos));

        }

        private test_minus() {
                console.debug("Test Coord: minus")

                this.initialize();

                this.test_pos2.x -= -8;
                this.test_pos2.y -= 57;

                rcj_assert_coord(this.test_pos.minus(new Coord(-8, 57)), this.test_pos2);

        }

        private test_plus() {
                console.debug("Test Coord: plus")

                this.initialize();

                this.test_pos2.x += 12;
                this.test_pos2.y += -7;

                rcj_assert_coord(this.test_pos.plus(new Coord(12, -7)), this.test_pos2);

                rcj_assert_true(this.test_pos.plus(this.test_pos2).equals(this.test_pos2.plus(this.test_pos)));
        }

        private test_scale() {
                console.debug("Test Coord: scale")

                this.initialize();

                this.test_pos2.x *= 7;
                this.test_pos2.y *= -3;

                this.test_pos.scale(new Coord(7, -3));

                rcj_assert_coord(this.test_pos, this.test_pos2);
        }

        private test_scale_square() {
                console.debug("Test Coord: scale square")

                this.initialize();

                this.test_pos2.x *= 2;
                this.test_pos2.y *= 2;

                rcj_assert_coord(this.test_pos.times_square(2), this.test_pos2);
        }

        private test_subtract() {
                console.debug("Test Coord: subtract")

                this.initialize();

                this.test_pos2.x -= -8;
                this.test_pos2.y -= 57;

                this.test_pos.subtract(new Coord(-8, 57));
                rcj_assert_coord(this.test_pos, this.test_pos2);

        }

        private test_times() {
                console.debug("Test Coord: times")

                this.initialize();

                this.test_pos2.x *= 7;
                this.test_pos2.y *= -3;

                rcj_assert_coord(this.test_pos.times(new Coord(7, -3)), this.test_pos2);

        }

        private test_times_square() {
                console.debug("Test Coord: times_square")

                this.initialize();

                this.test_pos2.x *= 2;
                this.test_pos2.y *= 2;

                rcj_assert_coord(this.test_pos.times_square(2), this.test_pos2);
        }
}