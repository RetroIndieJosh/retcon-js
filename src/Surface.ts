class Surface {
        protected pixels: NumberGrid;

        constructor(size: Coord) {
                this.pixels = new NumberGrid(size, 0, 16);
        }

        // TODO blit subsection with x, y, right, bottom and reuse that to optimize non-wrap blitting
        public blit(target_surface: Surface, top_left: Coord, wrap: boolean) {
                if (this.pixels == undefined) return;

                if (wrap) {
                        this.pixels.for_each((pos, value) => {
                                const pos2 = pos.add(top_left);
                                target_surface.set_pixel(pos2, value, true);
                        });
                }
                else {
                        target_surface.set_pixels(top_left, this.pixels, wrap);
                }
        }

        public clear(color_id: number) {
                this.pixels.set_all(color_id);
        }

        public copy_pixels(): NumberGrid {
                return this.pixels.copy();
        }

        public get_height(): number {
                return this.pixels.get_height();
        }

        public get_size(): Coord {
                return this.pixels.get_size();
        }

        public get_width(): number {
                return this.pixels.get_width();
        }

        public randomize_pixels() {
                this.pixels.randomize();
        }

        public render(only_changed = true) {
                this.pixels.for_each((pos, color) => Video.put_pixel(pos, color, only_changed));
                this.reset_changed();
        }

        public reset_changed() {
                // TODO rename to reset_changed
                this.pixels.clear_changed();
        }

        public set_pixel(pos: Coord, color_id: number, wrap: boolean = false) {
                this.pixels.set(pos, color_id, wrap);
        }

        public set_pixels(top_left: Coord, pixels: NumberGrid, wrap: boolean) {
                const width = Math.min(top_left.x + pixels.get_width(), this.pixels.get_width());
                const height = Math.min(top_left.y + pixels.get_height(), this.pixels.get_height());
                let pos = new Coord(0, 0);
                for (pos.y = 0; pos.y < height; pos.y++) {
                        for (pos.x = 0; pos.x < width; pos.x++) {
                                const pos2 = top_left.add(pos);
                                this.set_pixel(pos2, pixels.get(pos));
                        }
                }
        }
} 