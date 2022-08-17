function rcj_test_numbergrid(): void {
        console.debug("NumberGrid Tests Start");

        const size = 256;
        const tile_count = 8;
        
        // TODO make a new grid for each test and use {} to separate
        let grid = new NumberGrid(Coord.one.times_square(size), 0, tile_count);

        console.debug("Test NumberGrid: set all")
        for (let i = 0; i < tile_count; i++) {
                grid.set_all(i);
                for (let pos = Coord.zero; pos.x < size; pos.x++) {
                        for (pos.y = 0; pos.y < size; pos.y++) {
                                rcj_assert_equals(grid.get(pos), i);
                        }
                }
        }

        console.debug("Test NumberGrid: set single value")
        grid.set_all(0);
        for (let i = 0; i < size; i++) {
                const pos = Coord.random(new Coord(0, 0), new Coord(size, size));
                grid.set(pos, 1, false);
                rcj_assert_equals(1, grid.get(pos));
        }

        console.debug("Test NumberGrid: set with wrap")
        grid.set_all(0);
        for (let pos = new Coord(size, size); pos.x < size * 2; pos.x++) {
                for (pos.y = size; pos.y < size * 2; pos.y++) {
                        grid.set(pos, 1, true);
                }
        }
        // since we used wrap, the entire grid should be filled
        for (let pos = Coord.zero; pos.x < size; pos.x++) {
                for (pos.y = 0; pos.y < size; pos.y++) {
                        rcj_assert_equals(grid.get(pos), 1);
                }
        }

        console.debug("Test NumberGrid: set with clip")
        grid.set_all(0);
        for (let pos = new Coord(size, size); pos.x < size * 2; pos.x++) {
                for (pos.y = size; pos.y < size * 2; pos.y++) {
                        grid.set(pos, 1, false);
                }
        }
        // since we used clip, nothing in the grid should have changed
        for (let pos = Coord.zero; pos.x < size; pos.x++) {
                for (pos.y = 0; pos.y < size; pos.y++) {
                        rcj_assert_equals(grid.get(pos), 0);
                }
        }

        console.debug("Test NumberGrid: copy")
        grid.randomize();
        const grid2 = grid.copy();
        for (let pos = Coord.zero; pos.x < size; pos.x++) {
                for (pos.y = 0; pos.y < size; pos.y++) {
                        rcj_assert_equals(grid.get(pos), grid2.get(pos));
                }
        }

        console.debug("Test NumberGrid: for_each")
        let count = 0;
        grid.set_all(0);
        let copy = grid.copy();
        grid.set_all(1);
        // this should copy all values from grid to copy without missing any
        grid.for_each((pos, value) => {
                copy.set(pos, value, false);
                count++;
        });
        // check all values flagged in the copy
        for (let pos = Coord.zero; pos.x < size; pos.x++) {
                for (pos.y = 0; pos.y < size; pos.y++) {
                        rcj_assert_equals(grid.get(pos), copy.get(pos));
                }
        }

        console.debug("NumberGrid test complete");
}