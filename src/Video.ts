class Video
{
        private static instance: Video | undefined = undefined;

        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        private width: number | undefined = undefined;
        private height: number | undefined = undefined;
        private scale: number | undefined = undefined;

        private pixels: Array<Array<Color>> | undefined = undefined;

        public static start() {
                if (Video.instance == undefined) {
                        throw new Error("Tried to start video but it was not initialized");
                }

                setInterval(function () {
                        if (Video.instance == undefined) return;
                        Video.instance.clear(color_random());
                        Video.instance.draw();
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

                this.width = width;
                this.height = height;
                this.scale = scale;

                this.canvas.width = width * scale;
                this.canvas.height = height * scale;

                this.pixels = new Array(width);
                for (let x = 0; x < width; ++x) {
                        this.pixels[x] = new Array(height);
                }
                this.randomize_pixels();
        }

        public clear(color: Color) {
                this.forall_pixels(function (video: Video, x: number, y: number) {
                        video.set_pixel(x, y, color);
                });
        }

        public draw() {
                this.forall_pixels(function (video: Video, x: number, y: number) {
                        video.draw_pixel(x, y);
                });
        }

        public draw_pixel(x: number, y: number) {
                if (this.pixels == undefined || this.scale == undefined || this.out_of_bounds(x, y))
                        return;
                this.ctx.fillStyle = this.pixels[x][y];
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
        }

        public randomize_pixels() {
                this.forall_pixels(function (video: Video, x: number, y: number) {
                        video.set_pixel(x, y, color_random());
                });
        }

        public set_pixel(x: number, y: number, color: Color) {
                if (this.pixels == undefined || this.out_of_bounds(x, y)) return;
                this.pixels[x][y] = color;
        }

        private forall_pixels(func: (video: Video, x: number, y: number) => void) {
                if (this.width == undefined || this.height == undefined)
                        return;
                for (let x = 0; x < this.width; ++x)
                        for (let y = 0; y < this.height; ++y)
                                func(this, x, y);
        }

        private out_of_bounds(x: number, y: number): boolean {
                if (this.width == undefined || this.height == undefined)
                        return true;
                return x < 0 || x >= this.width || y < 0 || y >= this.height;
        }
} 
