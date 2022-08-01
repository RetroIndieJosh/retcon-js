class Video extends Surface
{
        private static instance: Video | undefined = undefined;

        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        private scale: number | undefined = undefined;

        private clear_color: Color = "#000";

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

                        instance.clear(instance.clear_color);
                        instance.sprite_list.forEach(function (sprite: Sprite) {
                                sprite.draw_sprite(instance);
                        });
                        instance.draw();
                }, 1000 / 60);
        }

        constructor(canvas_id: string, width: number, height: number, scale: number) {
                super(width, height, 1);

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

                this.randomize_pixels();
        }

        public add_sprite(sprite: Sprite) {
                this.sprite_list.push(sprite);
        }

        public render(x: number, y: number, color: Color) {
                if (this.scale == undefined)
                        return;
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        }

        public set_clear_color(color: Color) {
                this.clear_color = color;
        }
} 
