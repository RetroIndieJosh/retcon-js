// TODO should this be all static? to cut through get_instance? or even better, simply methods
class Video extends Surface
{
        private static instance: Video | undefined = undefined;

        public auto_clear: boolean = false;

        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        private scale: number | undefined = undefined;

        private clear_color: Color = "#000";

        private color_list: Array<Color> = new Array<Color>();
        private palette_list: Array<Palette> = new Array<Palette>();

        private background_list: Array<Surface> = new Array<Surface>();
        private sprite_list: Array<Sprite> = new Array<Sprite>();

        public static get_instance(): Video {
                if (Video.instance == undefined) {
                        throw new Error("Tried to get video but it was not initialized");
                }

                return Video.instance;
        }

        public static start() {
                if (Video.instance == undefined) return;

                setInterval(function () {
                        let instance: Video = Video.get_instance();
                        if (instance == undefined) return;

                        // clear if desired
                        if(instance.auto_clear)
                                instance.clear(instance.clear_color);

                        // blit backgrounds
                        // TODO background scrolling (extend Surface and disable alpha)
                        instance.background_list.forEach((background: Surface) => {
                                instance.blit(background, 0, 0);
                        });

                        // blit sprites
                        instance.sprite_list.forEach((sprite: Sprite) => {
                                sprite.draw(instance);
                        });

                        // render to browser
                        instance.render();
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

                this.scale = scale;
                this.canvas.width = width * scale;
                this.canvas.height = height * scale;

                // load colors
                this.color_list.push("rgba(0, 0, 0, 0)");
                const color_string_list = color_string.match(/.{1,3}/g);
                color_string_list?.forEach(color_string => this.color_list.push(`#${color_string}`));
                console.log(`Colors: ${this.color_list}`);

                this.randomize_pixels();
        }

        // TODO 
        public add_background(background: Surface) {}

        public add_palette(palette: Palette) {
                this.palette_list.push(palette);
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
                // TODO checking
                return this.color_list[color_id];
        }

        // TODO use tilesets
        public get_tile(tile_id: number) {
                return new Tile(8, 8, 0);
        }

        public get_palette(palette_id: number): Palette {
                // TODO checking
                return this.palette_list[palette_id];
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

        public sprite_count() : number { return this.sprite_list.length; }

        public render() {
                if (this.scale == undefined) return;

                for (let x = 0; x < this.get_width(); ++x) {
                        for (let y = 0; y < this.get_height(); ++y) {
                                this.ctx.fillStyle = this.get_pixel(x, y);
                                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
                        }
                }
        }

        public set_clear_color(color: Color, clear: boolean = true) {
                this.clear_color = color;
                if(clear) this.clear(this.clear_color);
        }
} 
