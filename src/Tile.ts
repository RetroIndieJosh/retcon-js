class Tile {
        private size: number = -1;
        private color_ids: NumberGrid;

        constructor(tile_data: string) {
                if (tile_data == "")
                        throw new Error("RetConJS: empty tile data");

                this.size = Math.sqrt(tile_data.length);
                if (!(this.size % 1 == 0))
                        throw new Error(`RetConJS: non-square tile size ${tile_data.length}`);

                this.color_ids = new NumberGrid(new Coord(this.size, this.size), 0, Video.tile_count);

                console.info(`load tile ${tile_data}`);

                let index = 0;
                let pos = new Coord(0, 0);
                let msg = "";
                for (; pos.y < this.size; pos.y++) {
                        for (pos.x = 0; pos.x < this.size; pos.x++) {
                                const hex = `0x${tile_data[index]}`;
                                this.color_ids.set(pos, Number(hex));
                                msg += `(${pos.x},${pos.y})/${index}=${hex}|${this.color_ids.get(pos)}) `;
                                index++;
                        }
                        msg += "\n";
                }
                console.info(msg);
        }

        public log() {
                let msg = "";
                let pos = new Coord(0, 0);
                for (; pos.y < this.size; pos.y++) {
                        for (pos.x = 0; pos.x < this.size; pos.x++) {
                                msg += `${this.color_ids.get(pos)} `;
                        }
                        msg += "\n";
                }

                console.info(`Tile size ${this.size}`);
                console.info(msg);
        }

        public blit(surface: Surface, palette: Palette, top_left: Coord, opaque: boolean, wrap: boolean) {
                let pos = new Coord(0, 0);
                for (; pos.y < this.size; pos.y++) {
                        for (pos.x = 0; pos.x < this.size; pos.x++) {
                                const pos2 = top_left.add(pos);

                                const palette_color_id = this.color_ids.get(pos);
                                if(palette_color_id == 0 && !opaque) {
                                        console.log("clear pixel");
                                        surface.set_pixel(pos2, 0, wrap);
                                        continue;
                                }

                                const color_id = palette.get_color_id(palette_color_id);
                                surface.set_pixel(pos2, color_id, wrap);
                        }
                }
        }

        public get_size(): number {
                return this.size;
        }

        public set_pixel(pos: Coord, palette_color_id: number) {
                this.color_ids.set(pos, palette_color_id);
        }
}

function rcj_test_tile() {
        console.debug("Tile Tests Start");

        console.debug("Test Tile: empty");
        rcj_assert_exception(() => { let fail = new Tile("") });

        console.debug("Test Tile: non-square");
        rcj_assert_exception(() => { let fail = new Tile("12345") });

        // TODO test blit
        // TODO test set_pixel
        // TODO test blit
        // TODO test blit
}
