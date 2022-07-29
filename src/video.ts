class Video
{
        private canvas: HTMLCanvasElement;
        private ctx: CanvasRenderingContext2D;

        private width: number = 64;
        private height: number = 64;
        private scale: number = 4;

        constructor(canvas_id: string, width: number, height: number, scale: number) {
                this.canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
                if (this.canvas == null) {
                }

                this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
                if (this.ctx == null) {
                        console.error("Failed to create canvas");
                        return;
                }

                this.width = width;
                this.height = height;
                this.scale = scale;

                this.canvas.width = width * scale;
                this.canvas.height = height * scale;

                var pixels = new Array(width);
                for (var x = 0; x < width; ++x) {
                        pixels[x] = new Array(height);
                }
        }

        draw() {
                for (var x = 0; x < this.width; ++x) {
                        for (var y = 0; y < this.height; ++y) {
                                this.ctx.fillStyle = random_color();
                                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
                        }
                }
        }
} 
