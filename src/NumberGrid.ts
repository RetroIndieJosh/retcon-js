const NUMBER_UNCHANGED = -1;

class NumberGrid {
        private width: number;
        private height: number;

        private min: number;
        private max: number;

        private changed: Array<Array<boolean>>;
        private values: Array<Array<number>>;

        constructor(width: number, height: number, min: number, max: number) {
                this.width = Math.floor(width);
                this.height = Math.floor(height);

                this.min = Math.floor(min);
                this.max = Math.floor(max);

                this.changed = new Array<Array<boolean>>(width);
                this.values = new Array<Array<number>>(width);
                for (let x = 0; x < width; ++x) {
                        this.values[x] = new Array<number>(height);
                        this.changed[x] = new Array<boolean>(height);
                }
                this.randomize();
        }

        public apply_each(func: (x: number, y: number, self: NumberGrid) => void) {
                for (let x = 0; x < this.width; x++) {
                        for (let y = 0; y < this.height; y++) {
                                func(x, y, this);
                        }
                }
        }

        public clear_changed() {
                this.apply_each((x, y, self) => this.changed[x][y] = false);
        }

        public for_each(func: (x: number, y: number, value: number) => void) {
                for (let x = 0; x < this.width; x++) {
                        for (let y = 0; y < this.height; y++) {
                                func(x, y, this.values[x][y]);
                        }
                }
        }

        public get(x: number, y: number) {
                x = Math.floor(x);
                y = Math.floor(y);
                if(this.changed[x][y])
                        return this.values[x][y];
                return NUMBER_UNCHANGED;
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

        public set_all(value: number, wrap: boolean) {
                for (let x = 0; x < this.width; x++) {
                        for (let y = 0; y < this.height; y++) {
                                this.set(x, y, value, wrap);
                        }
                }
        }

        public set(x: number, y: number, value: number, wrap: boolean) {
                x = Math.floor(x);
                y = Math.floor(y);

                if (wrap) {
                        // TODO horizontal crashes on second pass left
                        // TODO vertical disappears on second pass up
                        // wrap horizontal
                        if (x < 0) {
                                const div = Math.floor(x / this.width) + 1;
                                x += this.width * div;
                        }
                        else if (x >= this.width) {
                                const div = Math.floor(x / this.width);
                                x -= this.width * div;
                        }

                        // wrap vertical
                        if (y < 0) {
                                const div = Math.floor(y / this.height) + 1;
                                y += this.height * div;
                        }
                        else if (y >= this.height) {
                                const div = Math.floor(y / this.height);
                                y -= this.height * div;
                        }
                } else {
                        // clip
                        if (x < 0 || x >= this.width || y < 0 || y >= this.height)
                                return;
                }

                value = Math.floor(value);
                this.values[x][y] = value;
                this.changed[x][y] = true;
        }
}

