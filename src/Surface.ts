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

        public clear(color_id: number): void {
                this.pixels.set_all(color_id, false);
        }

        public draw(): void {
                Video.get_instance().blit(this, 0, 0, false);
        }

        // TODO shouldn't need this
        public get_pixel(x: number, y: number): number {
                return this.pixels.get(x, y);
        }

        public randomize_pixels(): void {
                this.pixels.randomize();
        }

        public set_pixel(x: number, y: number, color_id: number, wrap: boolean = false): void {
                this.pixels.set(x, y, color_id, wrap);
        }

        public set_pixels(left: number, top: number, pixels: NumberGrid, wrap: boolean): void {
                const width = Math.min(left + pixels.width, this.pixels.width);
                const height = Math.min(top + pixels.height, this.pixels.height);
                for (let x = 0; x < width; x++) {
                        for (let y = 0; y < height; y++) {
                                this.set_pixel(x + left, y + top, pixels.get(x, y));
                        }
                }
        }

        get size(): Size { return new Size(this.pixels.width, this.pixels.height); }

        public to_string(): string {
                return this.pixels.to_string();
        }
} 