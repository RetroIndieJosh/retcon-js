// TODO should this be all static? to cut through get_instance? or even better, simply methods
class Video
{
        private static canvas: HTMLCanvasElement;
        private static ctx: CanvasRenderingContext2D;

        private static scale: number | undefined = undefined;


        // TODO these are more like Game properties and shouldn't be in video?
        private static _palette_color_count: number;
        public static get palette_color_count() { return this._palette_color_count; }
        private static _tile_size: number; // tile is tile_size by tile_size pixels
        public static get tile_size() { return this._tile_size; }

        private static clear_color = 0;

        private static color_list = new Array<Color>();
        private static palette_list = new Array<Palette>();

        private static background_list = new Array<Tilemap>();
        private static sprite_list = new Array<Sprite>();
        private static tile_list = new Array<Tile>();

        private static surface: Surface;

        private static initialized = false;
        private static started = false;

        private static frames_per_second_target = 60;

        public static get color_count() { return this.color_list.length; }
        public static get palette_count() { return this.palette_list.length; }
        public static get sprite_count() { return this.sprite_list.length; }
        public static get tile_count() { return this.tile_list.length; }

        public static get is_initialized(): boolean {
                return this.initialized;
        }

        // TODO separate loading colors so this isn't so loaded
        // TODO also set canvas, width, height, scale separately ?
        public static initialize(canvas_id: string, size: Coord, scale: number, color_string: string): void {
                this.surface = new Surface(size);

                this.canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
                if (this.canvas == null) {
                        throw new Error(`Could not access canvas element by id '${canvas_id}'`);
                }

                this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
                if (this.ctx == null) {
                        throw new Error("Failed to create canvas");
                }

                this.scale = scale;
                this.canvas.width = size.x * scale;
                this.canvas.height = size.y * scale;

                // load colors
                const color_string_list = color_string.match(/.{1,3}/g);
                color_string_list?.forEach(color_string => this.color_list.push(`#${color_string}`));
                console.info("Colors:");
                for (let i = 0; i < this.color_list.length; i++) 
                        console.info(`    #${i} => ${this.color_list[i]}`);

                // TODO do this in game and load from json file
                this._palette_color_count = 4;
                this._tile_size = 8;


                this.initialized = true;
        }

        private static clear() {
                this.surface.clear(this.clear_color);
                // TODO since our surface is the entire canvas space, we shouldn't need to re-render
                //this.surface.render();
        }

        // TODO move to private, add to frame action list
        private static render() {
                this.clear();
                this.background_list.forEach(background => background.blit(this.surface));
                this.sprite_list.forEach(sprite => sprite.blit(this.surface));
                this.surface.render();
        }

        // TODO test
        public static set_framerate(fps: number) {
                if (this.started) {
                        console.warn("Cannot modify framerate while video is running!");
                        return;
                }

                this.frames_per_second_target = fps;
        }

        public static start(): void {
                if (this.started) {
                        console.warn("Tried to start video, but it's already running");
                        return;
                }

                setInterval(function () {
                        Video.render();

                        // TODO this should probably not be handling input
                        Input.clear();
                }, 1000 / this.frames_per_second_target);

                this.randomize();
                this.started = true;
        }

        // TODO 
        public static add_background(background: Tilemap) {
                // TODO prevent (allow?) duplication
                this.background_list.push(background);
        }

        public static add_color(color_str: string): number {
                if (color_str.length != 3 || !is_hex(color_str))
                        throw new Error("Color code must be three-digit hex number string");

                // TODO prevent duplication

                const index = this.color_count;
                this.color_list.push(`#${color_str}`);
                return index;
        }

        public static add_palette(palette: Palette): number {
                const index = this.palette_count;

                console.info(`Add palette #${index}`);
                palette.log();

                // TODO prevent duplication
                this.palette_list.push(palette);

                return index;
        }

        // TODO prevent duplication
        public static add_tile(tile: Tile): number {
                console.info(`Add tile #${this.tile_list.length}`);
                tile.log();

                const index = this.tile_count;
                this.tile_list.push(tile);
                return index;
        }

        // returns the index of the added sprite, or -1 if it wasn't added (already in list)
        public static add_sprite(sprite: Sprite): number {
                if(this.has_sprite(sprite)) {
                        console.warn(`this: tried to add sprite, but already in list: ${sprite}`)
                        return -1;
                }

                let id = this.sprite_list.length;
                this.sprite_list.push(sprite);
                sprite.log();
                return id;
        }

        public static get_color(color_id: number) {
                if (this.color_list.length == 0) {
                        throw new Error("RetConJS: No colors loaded - must have at least one!");
                }

                // TODO checking
                if (color_id < 0 || color_id >= this.color_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal color index: ${color_id}`);
                        return "#000";
                }

                return this.color_list[color_id];
        }

        public static get_palette(palette_id: number): Palette {
                if (this.palette_list.length == 0)
                        throw new Error("RetConJS: Trying to access palette, but none loaded!"); 

                if (palette_id < 0 || palette_id >= this.palette_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal palette index: ${palette_id}`);
                        return this.palette_list[0];
                }

                // TODO checking
                return this.palette_list[palette_id];
        }

        // TODO use tilesets
        public static get_tile(tile_id: number) {
                tile_id = Math.floor(tile_id);

                if (this.tile_list.length == 0)
                        throw new Error("RetConJS: Trying to access tile, but none loaded!"); 

                if (tile_id < 0 || tile_id >= this.tile_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal tile index: ${tile_id}`);
                        return this.tile_list[0];
                }
                return this.tile_list[tile_id];
        }

        public static list_elements(name: string, list: Array<Loggable>) {
                if (list.length == 0) {
                        console.debug(`No ${name}s`);
                        return;
                }

                console.debug(`Listing all loaded ${name}s`);
                list.forEach((value, index) => {
                        console.debug(`${name} #${index}:`);
                        value.log();
                });
                console.debug(`End of ${name}s`);
        }

        public static list_backgrounds() {
                this.list_elements("background", this.background_list);
        }

        public static list_colors() {
                console.debug("Listing all loaded colors");
                this.color_list.forEach((color, index) => console.debug(`Color #${index}: ${color}`));
                console.debug("End of colors");
        }

        public static list_palettes() {
                this.list_elements("palette", this.palette_list);
        }

        public static list_sprites() {
                this.list_elements("sprite", this.sprite_list);
        }

        public static list_tiles() {
                this.list_elements("tile", this.tile_list);
        }

        public static put_pixel(pos: Coord, color: number, only_changed = true) {
                if (only_changed && color == NUMBER_UNCHANGED) return;

                const scale = this.scale;
                if (scale == undefined) return;

                color = Math.floor(color);
                this.ctx.fillStyle = this.get_color(color);

                pos = pos.floor.scale_square(scale);
                this.ctx.fillRect(pos.x, pos.y, scale, scale);
        }

        public static randomize(): void {
                for (let pos = Coord.zero; pos.x < this.surface.get_width(); pos.x++) {
                        for (pos.y = 0; pos.y < this.surface.get_height(); pos.y++) {
                                //const color = Math.floor(Math.random() * this.color_list.length;
                                const color = Math.floor(Math.random() * this.color_count);

                                // TODO this works fine
                                //this.put_pixel(x, y, color);

                                // TODO this works only if numbergrid marks same color draws as dirty
                                this.surface.set_pixel(pos, color);
                        }
                }
        }

        // TODO avoid duplication with remove_sprite_at
        public static remove_palette_at(palette_id: number): boolean {
                if(palette_id < 0 || palette_id >= this.palette_count) {
                        console.warn(`this: index out of range trying to remove palette by id: ${palette_id}`);
                        return false;
                }

                this.palette_list.splice(palette_id, 1);
                return true;
        }

        // returns whether the sprite was removed
        public static remove_sprite(sprite: Sprite): boolean {
                if(!this.has_sprite(sprite)) {
                        console.warn(`this: tried to remove sprite not in list: ${sprite}`)
                        return false;
                }

                const sprite_id = this.sprite_list.indexOf(sprite);
                return this.remove_sprite_at(sprite_id);
        }

        // returns whether the sprite was removed
        public static remove_sprite_at(sprite_id: number): boolean {
                if(sprite_id < 0 || sprite_id >= this.sprite_count) {
                        console.warn(`this: index out of range trying to remove sprite by id: ${sprite_id}`);
                        return false;
                }

                this.sprite_list.splice(sprite_id, 1);
                return true;
        }

        public static set_clear_color(color_id: number, clear: boolean = true) {
                this.clear_color = color_id;
                if(clear) this.surface.clear(this.clear_color);
        }

        private static has_sprite(sprite: Sprite): boolean {
                return this.sprite_list.indexOf(sprite) >= 0;
        }

        public static test_pixel(value: number, pos: Coord): boolean { 
                return this.surface.get_pixel(pos) == value; 
        }
} 

// TODO move (utilities? numbers?)
function is_hex(hex: string): boolean {
        const regex = new RegExp("[0-9a-fA-F]+");
        return regex.test(hex);
}