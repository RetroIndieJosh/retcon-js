class Video
{
        private static instance: Video | undefined = undefined;

        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        private width: number | undefined = undefined;
        private height: number | undefined = undefined;
        private scale: number | undefined = undefined;

        private colors: Array<Array<Color>> | undefined = undefined;

        public static start() {
                if (Video.instance == undefined) {
                        throw new Error("Tried to start video but it was not initialized");
                }

                setInterval(function () {
                        if (Video.instance == undefined) return;
                        Video.instance.randomize_colors();
                        Video.instance.draw();
                }, 1000 / 60);
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

                this.colors = new Array(width);
                for (let x = 0; x < width; ++x) {
                        this.colors[x] = new Array(height);
                        for (let y = 0; y < height; ++y) {
                                this.colors[x][y] = random_color();
                        }
                }
        }

        /*
        public clear(color: Color) {
                for (let x = 0; x < this.width; ++x) {
                        for (let y = 0; y < this.height; ++y) {
                        }
                }
        }
        */

        public draw() {
                if (this.width == undefined || this.height == undefined || this.scale == undefined || this.colors == undefined)
                        return;
                for (let x = 0; x < this.width; ++x) {
                        for (let y = 0; y < this.height; ++y) {
                                this.ctx.fillStyle = this.colors[x][y];
                                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
                        }
                }
        }

        public redraw(x: number, y: number) {
                if (this.width == undefined || this.height == undefined)
                        return;
        }

        public randomize_colors() {
                if (this.width == undefined || this.height == undefined || this.scale == undefined || this.colors == undefined)
                        return;
                for (let x = 0; x < this.width; ++x) {
                        for (let y = 0; y < this.height; ++y) {
                                this.colors[x][y] = random_color();
                        }
                }
        }
} 

function random_color(include_alpha: boolean = false): Color {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);

        if (include_alpha) {
                let a = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, ${a})`;
        }

        return `rgb(${r}, ${g}, ${b})`;
}