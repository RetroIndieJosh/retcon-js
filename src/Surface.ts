class Surface {
        private width: number | undefined = undefined;
        private height: number | undefined = undefined;
        // TODO scale
        //private scale: number | undefined = undefined;

        private pixels: Array<Array<Color>> | undefined = undefined;

        constructor(width: number, height: number, scale: number) {
                this.width = width;
                this.height = height;
                //this.scale = scale;

                this.pixels = new Array(width);
                for (let x = 0; x < width; ++x) {
                        this.pixels[x] = new Array(height);
                }
                this.randomize_pixels();
        }

        public blit(target_surface: Surface, left: number, top: number) {
                this.forall_pixels(function (surface: Surface, x: number, y: number) {
                        if (surface.pixels == undefined) return;

                        // wrap
                        let xx = (left + x) % surface.get_width();
                        let yy = (top + y) % surface.get_height();
                        target_surface.set_pixel(xx, yy, surface.pixels[x][y]);
                });

        }

        public clear(color: Color) {
                this.forall_pixels(function (surface: Surface, x: number, y: number) {
                        surface.set_pixel(x, y, color);
                });
        }

        public draw() {
                this.forall_pixels(function (surface: Surface, x: number, y: number) {
                        surface.draw_pixel(x, y);
                });
        }

        public draw_pixel(x: number, y: number) {
                if (this.pixels == undefined)
                        return;
                
                render(x, y, this.pixels[x][y]);
        }

        public get_height(): number {
                if (this.height == undefined) return -1;
                return this.height;
        }

        public get_width(): number {
                if (this.width == undefined) return -1;
                return this.width;
        }

        public randomize_pixels() {
                this.forall_pixels(function (surface: Surface, x: number, y: number) {
                        surface.set_pixel(x, y, color_random());
                });
        }

        public set_pixel(x: number, y: number, color: Color) {
                if (this.pixels == undefined) return;

                // wrap
                x %= this.get_width();
                y %= this.get_height();

                this.pixels[x][y] = color;
        }

        private forall_pixels(func: (surface: Surface, x: number, y: number) => void) {
                if (this.width == undefined || this.height == undefined)
                        return;
                for (let x = 0; x < this.width; ++x)
                        for (let y = 0; y < this.height; ++y)
                                func(this, x, y);
        }
} 