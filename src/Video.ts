// TODO should this be all static? to cut through get_instance? or even better, simply methods
class Video extends Surface
{
        private static instance: Video | undefined = undefined;

        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        private _scale: number = 1;

        private clear_color: number = 0;

        private color_list: Array<Color> = new Array<Color>();
        private palette_list: Array<Palette> = new Array<Palette>();

        private sprite_list: Array<Sprite> = new Array<Sprite>();
        private tile_list: Array<Tile> = new Array<Tile>();

        private background: Tilemap | undefined = undefined;

        public static get_instance(): Video {
                if (Video.instance == undefined) {
                        throw new Error("Tried to get video but it was not initialized");
                }

                return Video.instance;
        }

        public static start() {
                if (Video.instance == undefined) return;

                const video: Video = Video.get_instance();

                // create background layers
                // TODO support arbitrary number of layers
                console.log("Create background layers");
                video.background = new Tilemap(8, 8, 8, 1); 

                console.log("Clear background layers");
                video.background.set_all(0);

                setInterval(function () {
                        video.ctx.fillStyle = video.get_color(video.clear_color);
                        video.ctx.fillRect(0, 0, video.canvas.width, video.canvas.height);

                        // TODO draw multiple backgrounds
                        //video.layer_list.forEach(background => background.blit(video));
                        video.background?.blit(video);
                        video.sprite_list.forEach(sprite => sprite.blit(video));
                        video.render();

                        // TODO handle input separately from render
                        Input.clear();
                }, 1000 / 60);
        }

        // TODO have a set number of color spaces available and initialize them to random values
        constructor(canvas_id: string, width: number, height: number, scale: number, color_string: string) {
                super(width, height);

                if (Video.instance != undefined) {
                        throw new Error("Video already defined (can only have one)");
                }

                Video.instance = this;

                this.canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
                if (this.canvas == null) {
                        throw new Error(`Could not access canvas element by id '${canvas_id}'`);
                }

                this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
                if (this.ctx == null) {
                        throw new Error("Failed to create canvas");
                }

                this._scale = scale;

                // load colors
                console.log("Load colors");
                const color_string_list = color_string.match(/.{1,3}/g);
                color_string_list?.forEach(color_string => this.color_list.push(`#${color_string}`));
                console.log(`Colors: ${this.color_list}`);
        }

        public add_palette(palette: Palette) {
                console.log(`Add palette ${palette}`);
                this.palette_list.push(palette);
        }

        public add_tile(tile: Tile) {
                this.tile_list.push(tile);
        }

        // returns the index of the added sprite, or -1 if it wasn't added (already in list)
        public add_sprite(sprite: Sprite): number {
                if(this.has_sprite(sprite)) {
                        console.warn(`Video: tried to add sprite, but already in list: ${sprite}`)
                        return -1;
                }

                this.sprite_list.push(sprite);
                return this.sprite_list.length - 1;
        }

        public color_count(): number {
                return this.color_list.length;
        }

        // TODO move to private section
        private has_sprite(sprite: Sprite): boolean {
                return this.sprite_list.indexOf(sprite) >= 0;
        }

        public get_color(color_id: number) {
                if (this.color_list.length == 0) {
                        throw console.error("RetConJS: No colors loaded - must have at least one!");
                }

                // TODO checking
                if (color_id < 0 || color_id >= this.color_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal color index: ${color_id}`);
                        return "#000";
                }

                return this.color_list[color_id];
        }

        public get_palette(palette_id: number): Palette {
                if (this.palette_list.length == 0) {
                        throw console.error("RetConJS: No palettes loaded - must have at least one!");
                }

                if (palette_id < 0 || palette_id >= this.palette_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal palette index: ${palette_id}`);
                        return this.palette_list[0];
                }

                // TODO checking
                return this.palette_list[palette_id];
        }

        // TODO use tilesets
        public get_tile(tile_id: number) {
                tile_id = Math.floor(tile_id);

                if (this.tile_list.length == 0) {
                        throw console.error("RetConJS: No tiles loaded - must have at least one!");
                }

                if (tile_id < 0 || tile_id >= this.tile_list.length) {
                        // TODO come up with some way to make these warnings faster so they don't lag the game
                        //console.warn(`Illegal tile index: ${tile_id}`);
                        return this.tile_list[0];
                }
                return this.tile_list[tile_id];
        }

        // returns whether the sprite was removed
        public remove_sprite(sprite: Sprite): boolean {
                if(!this.has_sprite(sprite)) {
                        console.warn(`Video: tried to remove sprite not in list: ${sprite}`)
                        return false;
                }

                const sprite_id = this.sprite_list.indexOf(sprite);
                return this.remove_sprite_at(sprite_id);
        }

        // returns whether the sprite was removed
        public remove_sprite_at(sprite_id: number): boolean {
                if(sprite_id < 0 || sprite_id >= this.sprite_list.length) {
                        console.warn(`Video: index out of range trying to remove sprite by id: ${sprite_id}`);
                        return false;
                }

                this.sprite_list.splice(sprite_id, 1);
                return true;
        }

        public text_display: boolean = true;

        public text_frame() {
                var text = "<div style='font: 14px Courier New'>";
                for(var y = 0; y < this.pixels.height; y++) {
                        for(var x = 0; x < this.pixels.width; x++) {
                                const color_id = this.pixels.get(x, y);
                                const color = this.get_color(this.pixels.get(x, y));
                                const color_str = color_id >= 0 ? color_id.toString(16) : 'X';
                                text += `<span style='text-color:${color}'>${color_str}</span>`;
                        }
                        text += "<br />";
                }
                text += "</div>";
                const game = document.getElementById("game");
                if(game == undefined) {
                        console.log("Cannot find 'game' element");
                        return;
                }
                game.innerHTML = text;
        }

        // draw one frame
        public render() {
                if (this._scale == undefined) return;

                const scale = this._scale;

                this.pixels.for_each((x, y, value) => {
                        if (value == NUMBER_UNCHANGED) return;
                        this.ctx.fillStyle = this.get_color(value);
                        //this.ctx.fillStyle = this.get_color(this.pixels.random_value());
                        this.ctx.fillRect(x * scale, y * scale, scale, scale);
                });
        }

        get scale() : number { return this._scale; }

        set scale(scale: number) { 
                this._scale = scale;
                this.update_scale();
        }

        // set all tiles in background bg_id to tile_id
        public set_bg_all(bg_id: number, tile_id: number) {
                this.background?.set_all(tile_id);
        }

        // TODO utilize bg_id
        // set tile in background bg_id at (x, y) to tile_id
        public set_bg_tile(bg_id: number, x: number, y: number, tile_id: number) {
                this.background?.set_tile(x, y, tile_id);
        }

        // set the background clear color on top of which all layers and sprites are drawn
        public set_clear_color(color_id: number, clear: boolean = true) {
                this.clear_color = color_id;
                if(clear) this.clear(this.clear_color);
        }

        // the number of sprites currently rendered
        get sprite_count() : number { return this.sprite_list.length; }

        // resize the video output
        public update_scale(): void {
                const width = Math.ceil(this.pixels.width * this._scale);
                const height = Math.ceil(this.pixels.height * this._scale);
                this.ctx.canvas.style.width = `${width}px`;
                this.ctx.canvas.style.height = `${height}px`;
        }
} 
