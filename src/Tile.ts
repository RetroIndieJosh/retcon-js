class Tile {
        private size: number = -1;
        private color_ids: Array<Array<number>> = new Array<Array<number>>();

        constructor(size: number, palette_id: number) {
                this.size = size;
                this.color_ids = new Array<Array<number>>(size);
                for (let x = 0; x < size; x++) {
                        this.color_ids[x] = new Array<number>(size);
                        for (let y = 0; y < size; y++) {
                                this.color_ids[x][y] = Math.floor(Math.random() * 16);
                        }
                }
        }

        public blit(surface: Surface, palette: Palette, left: number, top: number, opaque: boolean) {
                const video = Video.get_instance();
                for (let x = 0; x < this.size; x++) {
                        for (let y = 0; y < this.size; y++) {
                                const xx = x + left;
                                const yy = y + top;

                                const palette_color_id = this.color_ids[x][y];
                                if(palette_color_id == 0 && !opaque) {
                                        console.log("clear pixel");
                                        surface.set_pixel(xx, yy, "rgba(0, 0, 0, 0)");
                                        continue;
                                }

                                const color_id = palette.get_color_id(palette_color_id);
                                const color = video.get_color(color_id);
                                surface.set_pixel(xx, yy, color);
                        }
                }
        }

        public get_size(): number {
                return this.size;
        }

        public set_pixel(x: number, y: number, palette_color_id: number) {
                this.color_ids[x][y] = palette_color_id;
        }
}