// TODO should this be all static? to cut through get_instance? or even better, simply methods
class Video
{
        private static canvas: HTMLCanvasElement;
        private static ctx: CanvasRenderingContext2D;

        private static scale: number | undefined = undefined;

        private static clear_color = 0;

        private static color_list = new Array<Color>();
        private static palette_list = new Array<Palette>();

        private static background_list = new Array<Tilemap>();
        private static sprite_list = new Array<Sprite>();
        private static tile_list= new Array<Tile>();

        private static surface: Surface;

        private static initialized = false;

        public static is_initialized(): boolean {
                return Video.initialized;
        }

        public static initialize(canvas_id: string, width: number, height: number, scale: number, color_string: string): void {
                Video.surface = new Surface(width, height);

                Video.canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
                if (Video.canvas == null) {
                        throw new Error(`Could not access canvas element by id '${canvas_id}'`);
                }

                Video.ctx = Video.canvas.getContext('2d') as CanvasRenderingContext2D;
                if (Video.ctx == null) {
                        throw new Error("Failed to create canvas");
                }

                Video.scale = scale;
                Video.canvas.width = width * scale;
                Video.canvas.height = height * scale;

                // load colors
                const color_string_list = color_string.match(/.{1,3}/g);
                color_string_list?.forEach(color_string => Video.color_list.push(`#${color_string}`));
                console.info("Colors:");
                for (let i = 0; i < Video.color_list.length; i++) 
                        console.info(`    #${i} => ${Video.color_list[i]}`);

                Video.surface.randomize_pixels();

                Video.initialized = true;
        }

        private static clear() {
                Video.surface.clear(Video.clear_color);
                Video.surface.render();
        }

        // TODO move to private, add to frame action list
        private static render() {
                Video.clear();
                Video.background_list.forEach(background => background.blit(Video.surface));
                Video.sprite_list.forEach(sprite => sprite.blit(Video.surface));
                Video.surface.render();
        }

        public static start(): void {
                setInterval(function () {
                        Video.render();

                        // TODO Video should probably not be handling input
                        Input.clear();
                }, 1000 / 60);
        }

        // TODO 
        public static add_background(background: Tilemap) {
                // TODO prevent (allow?) duplication
                Video.background_list.push(background);
        }

                // TODO prevent duplication
                // TODO return index
        public static add_palette(palette: Palette) {
                console.info(`Add palette #${Video.palette_list.length}`);
                palette.log();
                // TODO prevent duplication
                Video.palette_list.push(palette);
        }

                // TODO prevent duplication
                // TODO return index
        public static add_tile(tile: Tile) {
                console.info(`Add tile #${Video.tile_list.length}`);
                tile.log();
                Video.tile_list.push(tile);
        }

        // returns the index of the added sprite, or -1 if it wasn't added (already in list)
        public static add_sprite(sprite: Sprite): number {
                if(Video.has_sprite(sprite)) {
                        console.warn(`Video: tried to add sprite, but already in list: ${sprite}`)
                        return -1;
                }

                let id = Video.sprite_list.length;
                Video.sprite_list.push(sprite);
                sprite.log();
                return id;
        }

        public static color_count(): number {
                return Video.color_list.length;
        }

        public static get_color(color_id: number) {
                if (Video.color_list.length == 0) {
                        throw console.error("RetConJS: No colors loaded - must have at least one!");
                }

                // TODO checking
                if (color_id < 0 || color_id >= Video.color_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal color index: ${color_id}`);
                        return "#000";
                }

                return Video.color_list[color_id];
        }

        public static get_palette(palette_id: number): Palette {
                if (Video.palette_list.length == 0) {
                        throw console.error("RetConJS: No palettes loaded - must have at least one!");
                }

                if (palette_id < 0 || palette_id >= Video.palette_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal palette index: ${palette_id}`);
                        return Video.palette_list[0];
                }

                // TODO checking
                return Video.palette_list[palette_id];
        }

        // TODO use tilesets
        public static get_tile(tile_id: number) {
                tile_id = Math.floor(tile_id);

                if (Video.tile_list.length == 0) {
                        throw console.error("RetConJS: No tiles loaded - must have at least one!");
                }

                if (tile_id < 0 || tile_id >= Video.tile_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal tile index: ${tile_id}`);
                        return Video.tile_list[0];
                }
                return Video.tile_list[tile_id];
        }

        public static put_pixel(x: number, y: number, color: number, only_changed = true) {
                if (only_changed && color == NUMBER_UNCHANGED) return;

                const scale = Video.scale;
                if (scale == undefined) return;

                x = Math.floor(x);
                y = Math.floor(y);
                color = Math.floor(color);

                Video.ctx.fillStyle = Video.get_color(color);
                Video.ctx.fillRect(x * scale, y * scale, scale, scale);
        }

        public static randomize(): void {
                //Video.surface.randomize_pixels();
                for (let x = 0; x < Video.surface.get_width(); x++) {
                        for (let y = 0; y < Video.surface.get_height(); y++) {
                                //const color = Math.floor(Math.random() * Video.color_list.length;
                                const palette = Video.get_palette(Math.floor(Math.random() * Video.palette_list.length));
                                const color = Math.floor(Math.random() * palette.color_count());

                                // TODO this works fine
                                //Video.put_pixel(x, y, color);

                                // TODO this works only if numbergrid marks same color draws as dirty
                                Video.surface.set_pixel(x, y, color);
                        }
                }
        }

        // returns whether the sprite was removed
        public static remove_sprite(sprite: Sprite): boolean {
                if(!Video.has_sprite(sprite)) {
                        console.warn(`Video: tried to remove sprite not in list: ${sprite}`)
                        return false;
                }

                const sprite_id = Video.sprite_list.indexOf(sprite);
                return Video.remove_sprite_at(sprite_id);
        }

        // returns whether the sprite was removed
        public static remove_sprite_at(sprite_id: number): boolean {
                if(sprite_id < 0 || sprite_id >= Video.sprite_list.length) {
                        console.warn(`Video: index out of range trying to remove sprite by id: ${sprite_id}`);
                        return false;
                }

                Video.sprite_list.splice(sprite_id, 1);
                return true;
        }

        public static set_clear_color(color_id: number, clear: boolean = true) {
                Video.clear_color = color_id;
                if(clear) Video.surface.clear(Video.clear_color);
        }

        private static has_sprite(sprite: Sprite): boolean {
                return Video.sprite_list.indexOf(sprite) >= 0;
        }

        public static sprite_count() : number { return Video.sprite_list.length; }
} 
