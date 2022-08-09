const NUMBER_UNCHANGED = -1;

class NumberGrid {
        private size: Coord;

        private min: number;
        private max: number;

        private changed: Array<Array<boolean>>;
        private values: Array<Array<number>>;

        constructor(size: Coord, min: number, max: number) {
                this.size = size.floor();

                this.min = Math.floor(min);
                this.max = Math.floor(max);

                this.changed = new Array<Array<boolean>>(size.x);
                this.values = new Array<Array<number>>(size.x);
                for (let x = 0; x < size.x; ++x) {
                        this.values[x] = new Array<number>(size.y);
                        this.changed[x] = new Array<boolean>(size.y);
                }
                this.randomize();
        }

        public clear_changed() {
                for (let x = 0; x < this.size.x; x++) {
                        for (let y = 0; y < this.size.y; y++) {
                                this.changed[x][y] = false;
                        }
                }
        }

        public copy(): NumberGrid {
                let copy_grid = new NumberGrid(this.size, this.min, this.max);
                for (let x = 0; x < this.size.x; x++) {
                        for (let y = 0; y < this.size.y; y++) {
                                copy_grid.changed[x][y] = this.changed[x][y];
                                copy_grid.values[x][y] = this.values[x][y];
                        }
                }
                return copy_grid;
        }

        public for_each(func: (pos: Coord, value: number) => void) {
                let pos = new Coord(0, 0);
                for (; pos.x < this.size.x; pos.x++) {
                        for (pos.y = 0; pos.y < this.size.y; pos.y++) {
                                func(pos, this.get(pos));
                        }
                }
        }

        public get(pos: Coord) {
                pos = pos.floor();
                if(this.changed[pos.x][pos.y])
                        return this.values[pos.x][pos.y];
                return NUMBER_UNCHANGED;
        }

        public get_height(): number {
                return this.size.y;
        }

        public get_size(): Coord {
                return this.size;
        }

        public get_width(): number {
                return this.size.x;
        }

        public randomize(): void {
                for (let x = 0; x < this.size.x; x++) {
                        for (let y = 0; y < this.size.y; y++) {
                                this.values[x][y] = this.random_value();
                        }
                }
        }

        public random_value() {
                return Math.floor(Math.random() * this.max) + this.min;
        }

        public set_all(value: number, wrap: boolean) {
                for (let pos = new Coord(0, 0); pos.x < this.size.x; pos.x++) {
                        for (pos.y = 0; pos.y < this.size.y; pos.y++) {
                                this.set(pos, value, wrap);
                        }
                }
        }

        public set(pos: Coord, value: number, wrap: boolean) {
                pos = pos.floor();

                if (wrap) {
                        // TODO horizontal crashes on second pass left
                        // TODO vertical disappears on second pass up
                        // wrap horizontal
                        if (pos.x < 0) {
                                const div = Math.floor(pos.x / this.size.x) + 1;
                                pos.x += this.size.x * div;
                        }
                        else if (pos.x >= this.size.x) {
                                const div = Math.floor(pos.x / this.size.x);
                                pos.x -= this.size.x * div;
                        }

                        // wrap vertical
                        if (pos.y < 0) {
                                const div = Math.floor(pos.y / this.size.y) + 1;
                                pos.y += this.size.y * div;
                        }
                        else if (pos.y >= this.size.y) {
                                const div = Math.floor(pos.y / this.size.y);
                                pos.y -= this.size.y * div;
                        }
                } else {
                        // clip
                        // TODO this is broken
                        //if (!pos.is_in(Coord.zero, this.size))
                                //return;
                }

                value = Math.floor(value);

                // TODO temporarily disabled because it breaks things
                // skip same color draws
                //if (this.values[pos.x][pos.y] != value) 
                        this.changed[pos.x][pos.y] = true;

                this.values[pos.x][pos.y] = value;
        }
}

function rcj_test_numbergrid(): void {
        const size = 256;
        const tile_count = 8;
        
        let grid = new NumberGrid(Coord.one().scale_square(size), 0, tile_count);

        for (let i = 0; i < tile_count; i++) {
                grid.set_all(i, false);
                for (let pos = Coord.zero(); pos.x < size; pos.x++) {
                        for (pos.y = 0; pos.y < size; pos.y++) {
                                rcj_assert_equals(grid.get(pos), i);
                        }
                }
        }

        // TODO test set single value
        grid.set_all(0, false);
        for (let i = 0; i < size; i++) {
                const pos = Coord.random(new Coord(0, 0), new Coord(size, size));
                grid.set(pos, 1, false);
                rcj_assert_equals(1, grid.get(pos));
        }

        // test wrap
        grid.set_all(0, false);
        for (let pos = new Coord(size, size); pos.x < size * 2; pos.x++) {
                for (pos.y = size; pos.y < size * 2; pos.y++) {
                        grid.set(pos, 1, true);
                }
        }
        for (let pos = Coord.zero(); pos.x < size; pos.x++) {
                for (pos.y = 0; pos.y < size; pos.y++) {
                        rcj_assert_equals(grid.get(pos), 1);
                }
        }

        // TODO test clip (make sure to uncomment it at L128)
        // TODO test copy
        // TODO test for_each

        console.log("NumberGrid test complete");
}