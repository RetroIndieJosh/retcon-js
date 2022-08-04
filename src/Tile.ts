class Tile {
        private size: number = -1;
        private color_ids: Array<Array<number>> = new Array<Array<number>>();

        constructor(tile_data: string) {
                this.size = Math.sqrt(tile_data.length);
                if (!(this.size % 1 == 0)) {
                        throw new Error(`RetConJS: non-square tile size ${tile_data.length}`);
                }

                this.color_ids = new Array<Array<number>>(this.size);
                for (let x = 0; x < this.size; x++) {
                        this.color_ids[x] = new Array<number>(this.size);
                }

                let index = 0;
                for (let y = 0; y < this.size; y++) {
                        for (let x = 0; x < this.size; x++) {
                                this.color_ids[x][y] = Number("0x" + tile_data[index]);
                                index++;
                        }
                }

                console.info(`Tile size ${this.size}: ${tile_data}`);
        }

        public blit(surface: Surface, palette: Palette, left: number, top: number, opaque: boolean, wrap: boolean) {
                const video = Video.get_instance();
                for (let x = 0; x < this.size; x++) {
                        for (let y = 0; y < this.size; y++) {
                                const xx = x + left;
                                const yy = y + top;

                                const palette_color_id = this.color_ids[x][y];
                                if(palette_color_id == 0 && !opaque) {
                                        console.log("clear pixel");
                                        surface.set_pixel(xx, yy, 0, wrap);
                                        continue;
                                }

                                const color_id = palette.get_color_id(palette_color_id);
                                surface.set_pixel(xx, yy, color_id, wrap);
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