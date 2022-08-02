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

class Surface extends Sized {
        private pixels: Array<Array<Color>> | undefined = undefined;

        constructor(width: number, height: number) {
                super(width, height);

                this.pixels = new Array<Array<Color>>(width);
                for (let x = 0; x < width; ++x) {
                        this.pixels[x] = new Array<Color>(height);
                }
                this.randomize_pixels();
        }

        public blit(target_surface: Surface, left: number, top: number) {
                if (this.pixels == undefined) return;

                const width = this.get_width();
                const height = this.get_height();
                const target_width = target_surface.get_width();
                const target_height = target_surface.get_height();
                for (let x = 0; x < width; ++x) {
                        const xx = left + x;
                        // TODO flag whether we wrap (this prevents wrapping)
                        if(xx < 0) continue;
                        if(xx >= target_width) continue;

                        for (let y = 0; y < height; ++y) {
                                const yy = top + y;
                                if(yy < 0) continue;
                                if(yy >= target_height) continue;

                                target_surface.set_pixel(left + x, top + y, this.pixels[x][y]);
                        }
                };
        }

        public clear(color: Color) {
                this.forall_pixels(function (surface: Surface, x: number, y: number) {
                        surface.set_pixel(x, y, color);
                });
        }

        public draw() {
                Video.get_instance().blit(this, 0, 0);
        }

        public get_pixel(x: number, y: number): Color {
                if (this.pixels == undefined) return "#000";
                x %= this.get_width();
                y %= this.get_height();
                return this.pixels[x][y];
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
                for (let x = 0; x < this.get_width(); ++x)
                        for (let y = 0; y < this.get_height(); ++y)
                                func(this, x, y);
        }
} 