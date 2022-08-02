// TODO move to its own file
class Sprite {
        public x: number = 0;
        public y: number = 0;

        private palette_id: number;
        private color_ids: Array<Array<number>> = new Array<Array<number>>();
        private surface: Surface;

        constructor(width: number, height: number, palette_id: number) {
                this.surface = new Surface(width, height);
                this.palette_id = palette_id;

                this.color_ids = new Array<Array<number>>(width);
                for (let x = 0; x < width; x++) {
                        this.color_ids[x] = new Array<number>(height);
                        for (let y = 0; y < height; y++) {
                                // TODO randomize
                                this.color_ids[x][y] = Math.floor(Math.random() * 16);
                        }
                }

                this.sync_pixels();
        }

        public draw(target_surface: Surface) {
                this.sync_pixels();
                this.surface.blit(target_surface, this.x, this.y);
        }

        public sync_pixels() {
                for (let x = 0; x < this.surface.get_width(); x++) {
                        for (let y = 0; y < this.surface.get_height(); y++) {
                                const color = Video.get_instance().get_color(this.palette_id, this.color_ids[x][y]);
                                this.surface.set_pixel(x, y, color);
                        }
                }
        }

        public set_pixel(x: number, y: number, palette_color_id: number) {
                this.color_ids[x][y] = palette_color_id;
        }
}