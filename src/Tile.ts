class Tile extends Sized {
        private color_ids: Array<Array<number>> = new Array<Array<number>>();

        constructor(width: number, height: number, palette_id: number) {
                super(width, height);

                this.color_ids = new Array<Array<number>>(width);
                for (let x = 0; x < width; x++) {
                        this.color_ids[x] = new Array<number>(height);
                        for (let y = 0; y < height; y++) {
                                this.color_ids[x][y] = Math.floor(Math.random() * 16);
                        }
                }
        }

        public sync_pixels(surface: Surface, palette: Palette) {
                for (let x = 0; x < surface.get_width(); x++) {
                        for (let y = 0; y < surface.get_height(); y++) {
                                const color_id = palette.get_color_id(this.color_ids[x][y]);
                                const color = Video.get_instance().get_color(color_id);
                                surface.set_pixel(x, y, color);
                        }
                }
        }

        public set_pixel(x: number, y: number, palette_color_id: number) {
                this.color_ids[x][y] = palette_color_id;
        }
}