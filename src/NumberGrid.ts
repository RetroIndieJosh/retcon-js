// TODO put in its own file
class NumberGrid {
        private width: number;
        private height: number;

        private min: number;
        private max: number;

        private values: Array<Array<number>>;

        private wrap: boolean;

        constructor(width: number, height: number, min: number, max: number, wrap: boolean = false) {
                this.width = Math.floor(width);
                this.height = Math.floor(height);

                this.min = Math.floor(min);
                this.max = Math.floor(max);

                this.wrap = wrap;

                this.values = new Array<Array<number>>(width);
                for (let x = 0; x < width; ++x) {
                        this.values[x] = new Array<number>(height);
                }
                this.randomize();
        }

        public apply_each(func: (x: number, y: number, self: NumberGrid) => void) {
                for (let x = 0; x < this.width; x++) {
                        for (let y = 0; y < this.width; y++) {
                                func(x, y, this);
                        }
                }

        }

        public for_each(func: (x: number, y: number, value: number) => void) {
                for (let x = 0; x < this.width; x++) {
                        for (let y = 0; y < this.width; y++) {
                                func(x, y, this.values[x][y]);
                        }
                }
        }

        public get(x: number, y: number) {
                x = Math.floor(x);
                y = Math.floor(y);
                return this.values[x][y];
        }

        public get_height(): number {
                if (this.height == undefined) return -1;
                return this.height;
        }

        public get_width(): number {
                if (this.width == undefined) return -1;
                return this.width;
        }

        public randomize(): void {
                this.apply_each((x, y, self) => self.values[x][y] = self.random_value());
        }

        public random_value() {
                return Math.floor(Math.random() * this.max) + this.min;
        }

        public set_all(value: number) {
                for (let x = 0; x < this.width; x++) {
                        for (let y = 0; y < this.width; y++) {
                                this.set(x, y, value);
                        }
                }
        }

        public set(x: number, y: number, value: number) {
                if (this.wrap) {
                        // wrap horizontal
                        while (x < 0) x += this.width;
                        while (x >= this.width) x -= this.width;

                        // wrap vertical
                        while (y < 0) y += this.height;
                        while (y >= this.height) y -= this.height;
                } else {
                        // clip
                        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                                return;
                }

                x = Math.floor(x);
                y = Math.floor(y);
                value = Math.floor(value);
                this.values[x][y] = value;
        }
}

