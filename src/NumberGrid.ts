const NUMBER_UNCHANGED = -1;

class NumberGrid {
        private _width: number;
        private _height: number;

        private min: number;
        private max: number;

        private changed: Array<Array<boolean>>;
        private values: Array<Array<number>>;

        constructor(width: number, height: number, min: number, max: number) {
                this._width = Math.floor(width);
                this._height = Math.floor(height);

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
                for (let x = 0; x < this._width; x++) {
                        for (let y = 0; y < this._height; y++) {
                                func(x, y, this);
                        }
                }
        }

        public clear_changed() {
                this.apply_each((x, y, self) => this.changed[x][y] = false);
        }

        public for_each(func: (x: number, y: number, value: number) => void) {
                for (let x = 0; x < this._width; x++) {
                        for (let y = 0; y < this._height; y++) {
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

        get height(): number {
                if (this._height == undefined) return -1;
                return this._height;
        }

        get width(): number {
                if (this._width == undefined) return -1;
                return this._width;
        }

        public randomize(): void {
                this.apply_each((x, y, self) => self.values[x][y] = self.random_value());
        }

        public random_value() {
                return Math.floor(Math.random() * this.max) + this.min;
        }

        public set_all(value: number, wrap: boolean) {
                for (let x = 0; x < this._width; x++) {
                        for (let y = 0; y < this._height; y++) {
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
                                const div = Math.floor(x / this._width) + 1;
                                x += this._width * div;
                        }
                        else if (x >= this._width) {
                                const div = Math.floor(x / this._width);
                                x -= this._width * div;
                        }

                        // wrap vertical
                        if (y < 0) {
                                const div = Math.floor(y / this._height) + 1;
                                y += this._height * div;
                        }
                        else if (y >= this._height) {
                                const div = Math.floor(y / this._height);
                                y -= this._height * div;
                        }
                } else {
                        // clip
                        if (x < 0 || x >= this._width || y < 0 || y >= this._height)
                                return;
                }

                value = Math.floor(value);
                this.values[x][y] = value;
                this.changed[x][y] = true;
        }

        public to_html(): string {
                var text = "";
                for(var y = 0; y < this.height; y++) {
                        for(var x = 0; x < this.width; x++) {
                                text += ('00' + this.values[x][y].toString(16)).slice(-2);
                        }
                        text += "<br />";
                }
                return `<div>${text}</div>`;
        }
}
