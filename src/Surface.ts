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

                this.pixels = new Array<Array<Color>>(width);
                for (let x = 0; x < width; ++x) {
                        this.pixels[x] = new Array<Color>(height);
                }
                this.randomize_pixels();
        }

        public blit(target_surface: Surface, left: number, top: number) {
                this.forall_pixels(function (surface: Surface, x: number, y: number) {
                        if (surface.pixels == undefined) return;
                        target_surface.set_pixel(left + x, top + y, surface.pixels[x][y]);
                });

        }

        public clear(color: Color) {
                this.forall_pixels(function (surface: Surface, x: number, y: number) {
                        surface.set_pixel(x, y, color);
                });
        }

        public draw() {
                Video.get_instance().blit(this, 0, 0);
        }

        public get_height(): number {
                if (this.height == undefined) return -1;
                return this.height;
        }

        public get_pixel(x: number, y: number): Color {
                if (this.pixels == undefined) return "#000";
                x %= this.get_width();
                y %= this.get_height();
                return this.pixels[x][y];
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

                // wrap horizontal
                const width = this.get_width();
                while(x < 0) x += width;
                while(x >= width) x -= width;

                // wrap vertical
                const height = this.get_height();
                while(y < 0) y += height;
                while(y >= height) y -= height;

                this.pixels[x][y] = color;
        }

        protected forall_pixels(func: (surface: Surface, x: number, y: number) => void) {
                if (this.width == undefined || this.height == undefined)
                        return;
                for (let x = 0; x < this.width; ++x)
                        for (let y = 0; y < this.height; ++y)
                                func(this, x, y);
        }
} 