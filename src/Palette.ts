class Palette {
        private color_ids: Array<number> = new Array<number>;

        public get color_count() { return this.color_ids.length; }

        constructor(palette_string: string) {
                for (let i = 0; i < palette_string.length; i++) {
                        const ch = palette_string[i];
                        const hex = `0x${ch}`;
                        this.color_ids.push(Number(hex));
                }
        }

        public log() {
                console.info(`Palette with ${this.color_ids.length} colors`);
                for (let i = 0; i < this.color_ids.length; i++)
                        console.info(`    ${i} => ${this.color_ids[i]}`);
        }

        // convert an index in the list of palette colors to index in the Video colors
        public get_color_id(palette_color_id: number): number {
                if(palette_color_id <0 || palette_color_id >= this.color_ids.length)
                        return 0;
                return this.color_ids[palette_color_id];
        }
}