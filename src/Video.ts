// TODO should this be all static? to cut through get_instance? or even better, simply methods
class Video
{
        // TODO these are more like Game properties and shouldn't be in video?
        private static _palette_color_count = 4;
        public static get palette_color_count() { return this._palette_color_count; }

        // tiles are tile_size by tile_size pixels
        private static _tile_size = 8;
        public static get tile_size() { return this._tile_size; }
        public static get tile_size_coord() { return new Coord(this._tile_size, this._tile_size); }

        private static canvas: HTMLCanvasElement;
        private static ctx: CanvasRenderingContext2D;

        private static scale: number | undefined = undefined;

        private static clear_color = 0;

        private static colors = new Array<Color>();
        private static palettes = new Array<Palette>();

        private static backgrounds = new Array<Tilemap>();
        private static sprites = new Array<Sprite>();
        private static tiles = new Array<Tile>();

        private static surface: Surface;

        private static initialized = false;
        private static started = false;

        private static frames_per_second_target = 30;
        private static frame_events = new Array<(dt: number) => void>();
        private static prev_frame_time = 0;
        private static dt = 0;

        //
        // getters
        //

        public static get color_count() { return this.colors.length; }
        public static get palette_count() { return this.palettes.length; }
        public static get sprite_count() { return this.sprites.length; }
        public static get tile_count() { return this.tiles.length; }
        
        public static get is_initialized(): boolean {
                return this.initialized;
        }

        //
        // initialization
        //

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
                const color_strings = color_string.match(/.{1,3}/g);
                color_strings?.forEach(color_string => this.colors.push(`#${color_string}`));
                console.info("Colors:");
                for (let i = 0; i < this.colors.length; i++) 
                        console.info(`    #${i} => ${this.colors[i]}`);

                this.randomize();

                this.initialized = true;
        }

        public static start(): void {
                if (!this.is_initialized)
                        throw new Error("Video must be initialized before starting");

                if (this.started)
                        throw new Error("Tried to start video, but it's already running");

                setInterval(function () {
                        Video.render();

                        Video.dt = new Date().getTime() - Video.prev_frame_time;
                        Video.frame_events.forEach(func => func(Video.dt));
                        //console.debug(`dt = ${Video.dt}`);

                        Video.prev_frame_time = new Date().getTime();
                }, 1000 / this.frames_per_second_target);

                this.started = true;
        }

        //
        // public static
        //

        public static add_frame_event(func: (dt: number) => void) {
                this.frame_events.push(func);
        }

        public static add_background(background: Tilemap) {
                // TODO prevent (allow?) duplication
                this.backgrounds.push(background);
        }

        public static add_color(color_str: string): number {
                if (color_str.length != 3 || !is_hex(color_str))
                        throw new Error("Color code must be three-digit hex number string");

                // TODO prevent duplication

                const index = this.color_count;
                this.colors.push(`#${color_str}`);
                return index;
        }

        public static add_palette(palette: Palette): number {
                const index = this.palette_count;

                console.info(`Add palette #${index}`);
                palette.log();

                // TODO prevent duplication
                this.palettes.push(palette);

                return index;
        }

        // returns the index of the added sprite, or -1 if it wasn't added (already in list)
        public static add_sprite(sprite: Sprite): number {
                if(this.has_sprite(sprite)) {
                        console.warn(`this: tried to add sprite, but already in list: ${sprite}`)
                        return -1;
                }

                let id = this.sprites.length;
                this.sprites.push(sprite);
                sprite.log();
                return id;
        }

        // TODO prevent duplication
        public static add_tile(tile: Tile): number {
                console.info(`Add tile #${this.tiles.length}`);
                tile.log();

                const index = this.tile_count;
                this.tiles.push(tile);
                return index;
        }

        public static get_color(color_id: number) {
                if (this.colors.length == 0) {
                        throw new Error("RetConJS: No colors loaded - must have at least one!");
                }

                // TODO checking
                if (color_id < 0 || color_id >= this.colors.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal color index: ${color_id}`);
                        return "#000";
                }

                return this.colors[color_id];
        }

        public static get_palette(palette_id: number): Palette {
                if (this.palettes.length == 0)
                        throw new Error("RetConJS: Trying to access palette, but none loaded!"); 

                if (palette_id < 0 || palette_id >= this.palettes.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal palette index: ${palette_id}`);
                        return this.palettes[0];
                }

                // TODO checking
                return this.palettes[palette_id];
        }

        // TODO use tilesets
        public static get_tile(tile_id: number) {
                tile_id = Math.floor(tile_id);

                if (this.tiles.length == 0)
                        throw new Error("RetConJS: Trying to access tile, but none loaded!"); 

                if (tile_id < 0 || tile_id >= this.tiles.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal tile index: ${tile_id}`);
                        return this.tiles[0];
                }
                return this.tiles[tile_id];
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
                this.list_elements("background", this.backgrounds);
        }

        public static list_colors() {
                console.debug("Listing all loaded colors");
                this.colors.forEach((color, index) => console.debug(`Color #${index}: ${color}`));
                console.debug("End of colors");
        }

        public static list_palettes() {
                this.list_elements("palette", this.palettes);
        }

        public static list_sprites() {
                this.list_elements("sprite", this.sprites);
        }

        public static list_tiles() {
                this.list_elements("tile", this.tiles);
        }

        public static put_pixel(pos: Coord, color: number, only_changed = true) {
                if (only_changed && color == NUMBER_UNCHANGED) return;

                const scale = this.scale;
                if (scale == undefined) return;

                color = Math.floor(color);
                this.ctx.fillStyle = this.get_color(color);

                pos = pos.floor.times_square(scale);
                this.ctx.fillRect(pos.x, pos.y, scale, scale);
        }

        public static randomize(): void {
                for (let pos = Coord.zero; pos.x < this.surface.get_width(); pos.x++) {
                        for (pos.y = 0; pos.y < this.surface.get_height(); pos.y++) {
                                const color = random_int(0, Video.color_count);
                                this.put_pixel(pos, color);
                        }
                }
        }

        // TODO avoid duplication with remove_sprite_at
        public static remove_palette_at(palette_id: number): boolean {
                if(palette_id < 0 || palette_id >= this.palette_count) {
                        console.warn(`this: index out of range trying to remove palette by id: ${palette_id}`);
                        return false;
                }

                this.palettes.splice(palette_id, 1);
                return true;
        }

        // returns whether the sprite was removed
        public static remove_sprite(sprite: Sprite): boolean {
                if(!this.has_sprite(sprite)) {
                        console.warn(`this: tried to remove sprite not in list: ${sprite}`)
                        return false;
                }

                const sprite_id = this.sprites.indexOf(sprite);
                return this.remove_sprite_at(sprite_id);
        }

        // returns whether the sprite was removed
        public static remove_sprite_at(sprite_id: number): boolean {
                if(sprite_id < 0 || sprite_id >= this.sprite_count) {
                        console.warn(`this: index out of range trying to remove sprite by id: ${sprite_id}`);
                        return false;
                }

                this.sprites.splice(sprite_id, 1);
                return true;
        }

        public static set_clear_color(color_id: number, clear: boolean = true) {
                this.clear_color = color_id;
                if(clear) this.surface.clear(this.clear_color);
        }

        // TODO make this a setter (and add matching getter)
        // TODO test
        public static set_framerate(fps: number) {
                if (this.started) {
                        console.warn("Cannot modify framerate while video is running!");
                        return;
                }

                this.frames_per_second_target = fps;
        }

        public static test_pixel(value: number, pos: Coord): boolean { 
                return this.surface.get_pixel(pos) == value; 
        }

        public static toString() {
                return this.surface;
        }

        //
        // private static
        //

        // TDOO make this a getter
        private static clear() {
                this.surface.clear(this.clear_color);
                // TODO since our surface is the entire canvas space, we shouldn't need to re-render
                //this.surface.render();
        }

        private static has_sprite(sprite: Sprite): boolean {
                return this.sprites.indexOf(sprite) >= 0;
        }

        private static render() {
                this.clear();
                this.backgrounds.forEach(background => background.blit(this.surface));
                this.sprites.forEach(sprite => sprite.blit(this.surface));
                this.surface.render();

                this.backgrounds = this.backgrounds.filter(background => !background.marked_for_deletion);
                this.sprites = this.sprites.filter(sprite => !sprite.marked_for_deletion);
        }
} 