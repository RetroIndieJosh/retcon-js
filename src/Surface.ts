//class Surface implements Loggable {
class Surface {
        protected _pixels: NumberGrid;

        public get pixels(): NumberGrid { return this._pixels; }

        public get height(): number { return this._pixels.height; }
        public get size(): Coord { return this._pixels.size; }
        public get width(): number { return this._pixels.width; }

        constructor(size: Coord) {
                this._pixels = new NumberGrid(size, 0, 16);
                this._pixels.randomize();
        }

        public blit(target_surface: Surface, top_left: Coord, wrap: boolean) {
                if (this._pixels == undefined) return;

                if (wrap) {
                        console.error("Wrap is currently not implemented");
                        return;
                        /*
                        this.pixels.for_each((pos, value) => {
                                const pos2 = pos.add(top_left);
                                target_surface.set_pixel(pos2, value, true);
                        });
                        */
                }
                else {
                        target_surface.set_pixels(top_left, this._pixels, wrap);
                }
        }

        public clear(color_id: number) {
                this._pixels.set_all(color_id);
        }

        public copy_pixels(): NumberGrid {
                return this._pixels.copy();
        }

        public get_pixel(pos: Coord): number {
                return this._pixels.get(pos);
        }

        public get_pixels(top_left: Coord, size: Coord) {
                // TODO

        }

        public randomize_pixels() {
                this._pixels.randomize();
        }

        public render(only_changed = true) {
                this._pixels.for_each((pos, color) => Video.put_pixel(pos, color, only_changed));
                this.reset_changed();
        }

        public reset_changed() {
                this._pixels.reset_changed();
        }

        public set_pixel(pos: Coord, color_id: number, wrap = false) {
                this._pixels.set(pos, color_id, wrap);
        }

        public set_pixels(top_left: Coord, pixels: NumberGrid, wrap: boolean) {
                // TODO fix for clipping
                //const width = Math.min(top_left.x + pixels.get_width(), this.pixels.get_width());
                //const height = Math.min(top_left.y + pixels.height, this.pixels.height());
                const width = pixels.width;
                const height = pixels.height;

                for (let pos = new Coord(0, 0); pos.y < height; pos.y++) {
                        for (pos.x = 0; pos.x < width; pos.x++) {
                                const pos2 = top_left.plus(pos);
                                this.set_pixel(pos2, pixels.get(pos));
                        }
                }
        }
} 

function rcj_test_surface(): void {
        console.debug("Surface Tests Start");

        const width = 16;
        const height = 32;
        let surf = new Surface(new Coord(width, height));

        console.debug("Test Surface: clear");
        surf.randomize_pixels();
        surf.clear(0);
        for (let pos = new Coord(0, 0); pos.y < height; pos.y++) {
                for (pos.x = 0; pos.x < width; pos.x++) {
                        rcj_assert_equals(0, surf.get_pixel(pos));
                }
        }

        console.debug("Test Surface: set_pixel");
        for (let i = 0; i < width * height; i++) {
                const pos = Coord.random(new Coord(0, 0), new Coord(width, height));
                surf.set_pixel(pos, 1, false);
                rcj_assert_equals(1, surf.get_pixel(pos));
        }

        {
                console.debug("Test Surface: set_pixels on all");

                const surf2 = new Surface(new Coord(width, height));

                surf.set_pixels(Coord.zero, surf2.pixels, false);
                for (let pos = new Coord(0, 0); pos.y < height; pos.y++) {
                        for (pos.x = 0; pos.x < width; pos.x++) {
                                rcj_assert_equals(surf.get_pixel(pos), surf.get_pixel(pos));
                        }
                }
        }

        {
                console.debug("Test Surface: set_pixels from smaller (clip)");

                const surf_small = new Surface(new Coord(width / 2, height / 2));

                surf.set_pixels(Coord.zero, surf_small.pixels, false);
                for (let pos = new Coord(0, 0); pos.y < height / 2; pos.y++) {
                        for (pos.x = 0; pos.x < width / 2; pos.x++) {
                                rcj_assert_equals(surf_small.get_pixel(pos), surf.get_pixel(pos));
                        }
                }
        }

        {
                console.debug("Test Surface: set_pixels from larger (clip)");

                const surf_large = new Surface(new Coord(width * 2, height * 2));

                surf.set_pixels(Coord.zero, surf_large.pixels, false);
                for (let pos = new Coord(0, 0); pos.y < height; pos.y++) {
                        for (pos.x = 0; pos.x < width; pos.x++) {
                                rcj_assert_equals(surf_large.get_pixel(pos), surf.get_pixel(pos));
                        }
                }
        }

        {
                //console.debug("Test Surface: set_pixels wrap");
                // TODO figure out how to test wrapped values
        }

        // TODO test reset_changed ?

        // TODO test render
        //console.debug("Test render");

        {
                console.debug("Test Surface: blit matching size");

                let surf2 = new Surface(new Coord(width, height));

                surf2.blit(surf, Coord.zero, false);
                for (let pos = new Coord(0, 0); pos.y < height; pos.y++) {
                        for (pos.x = 0; pos.x < width; pos.x++) {
                                rcj_assert_equals(surf2.get_pixel(pos), surf.get_pixel(pos));
                        }
                }
        }

        // TODO
        {
                console.debug("Test Surface: blit smaller with offset (clip)");

                const offset = new Coord(8, 7);
                const surf_small = new Surface(new Coord(width / 2, height / 2));

                surf.blit(surf_small, offset, false);
                for (let pos = new Coord(0, 0); pos.y < height / 2; pos.y++) {
                        for (pos.x = 0; pos.x < width / 2; pos.x++) {
                                rcj_assert_equals(surf_small.get_pixel(pos), surf.get_pixel(pos.plus(offset)));
                        }
                }
        }

        {
                console.debug("Test Surface: blit larger, no offset (clip)");
                const surf_large = new Surface(new Coord(width * 2, height * 2));

                surf.blit(surf_large, Coord.zero, false);
                for (let pos = new Coord(0, 0); pos.y < height; pos.y++) {
                        for (pos.x = 0; pos.x < width; pos.x++) {
                                rcj_assert_equals(surf_large.get_pixel(pos), surf.get_pixel(pos));
                        }
                }
        }

        {
                //console.debug("Test Surface: blit wrap");
                // TODO figure out how to test wrapped values
        }

        console.debug("Surface tests complete");
}