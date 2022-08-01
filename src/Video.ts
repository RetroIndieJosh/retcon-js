class Video
{
        private static instance: Video | undefined = undefined;

        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        private surface: Surface;
        private scale: number | undefined = undefined;

        private pixels: Array<Array<Color>> | undefined = undefined;

        public static get_instance(): Video {
                if (Video.instance == undefined) {
                        throw new Error("Tried to get video but it was not initialized");
                }

                return Video.instance;
        }

        public static start() {
                setInterval(function () {
                        let instance: Video = Video.get_instance();
                        if (instance == undefined) return;
                        instance.clear(color_random());
                        instance.draw();
                }, 1000);
        }

        constructor(canvas_id: string, width: number, height: number, scale: number) {
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

                this.surface = new Surface(width, height, 1);

                this.scale = scale;
                this.canvas.width = width * scale;
                this.canvas.height = height * scale;

                this.surface.randomize_pixels();
        }

        public clear(color: Color) {
                this.surface.clear(color);
        }

        public draw() {
                this.surface.draw();
        }

        public draw_pixel(x: number, y: number, color: Color) {
                if (this.scale == undefined || this.out_of_bounds(x, y))
                        return;
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        }

        public randomize_pixels() {
                this.surface.randomize_pixels();
        }

        public set_pixel(x: number, y: number, color: Color) {
                this.surface.set_pixel(x, y, color);
        }

        private out_of_bounds(x: number, y: number): boolean {
                return false;
                // TODO fix
                /*
                if (this.width == undefined || this.height == undefined)
                        return true;
                return x < 0 || x >= this.width || y < 0 || y >= this.height;
                */
        }
} 
