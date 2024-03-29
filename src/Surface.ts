// TODO remove
class Sized {
        private width: number = -1;
        private height: number = -1;

        constructor(width: number, height: number) {
                this.width = width;
                this.height = height;
        }

        public get_height(): number {
                if (this.height == undefined) return -1;
                return this.height;
        }

        public get_width(): number {
                if (this.width == undefined) return -1;
                return this.width;
        }
}

class Surface {
        protected pixels: NumberGrid;

        constructor(width: number, height: number) {
                this.pixels = new NumberGrid(width, height, 0, 16);
        }

        // TODO blit subsection with x, y, right, bottom and reuse that to optimize non-wrap blitting
        public blit(target_surface: Surface, left: number, top: number, wrap: boolean) {
                if (this.pixels == undefined) return;

                if (wrap) {
                        this.pixels.for_each((x, y, value) => {
                                const xx = left + x;
                                const yy = top + y;

                                target_surface.set_pixel(left + x, top + y, value, true);
                        });
                }
                else {
                        target_surface.set_pixels(left, top, this.pixels, wrap);
                }
        }

        public clear(color_id: number) {
                this.pixels.set_all(color_id, false);
        }

        public draw() {
                Video.get_instance().blit(this, 0, 0, false);
        }

        // TODO shouldn't need this
        public get_pixel(x: number, y: number): number {
                return this.pixels.get(x, y);
        }


        public randomize_pixels() {
                this.pixels.randomize();
        }

        public set_pixel(x: number, y: number, color_id: number, wrap: boolean = false) {
                this.pixels.set(x, y, color_id, wrap);
        }

        public set_pixels(left: number, top: number, pixels: NumberGrid, wrap: boolean) {
                const width = Math.min(left + pixels.get_width(), this.pixels.get_width());
                const height = Math.min(top + pixels.get_height(), this.pixels.get_height());
                for (let x = 0; x < width; x++) {
                        for (let y = 0; y < height; y++) {
                                this.set_pixel(x + left, y + top, pixels.get(x, y));
                        }
                }
        }
} 