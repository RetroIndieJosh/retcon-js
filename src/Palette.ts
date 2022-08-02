class Palette {
        private color_ids: Array<number> = new Array<number>;

        constructor(palette_string: string) {
                for (let i = 0; i < palette_string.length; i++) {
                        const ch = palette_string[i];
                        const hex = `0x${ch}`;
                        this.color_ids.push(Number(hex));
                }
                
                console.log(`"Palette: ${this.color_ids}`)
                this.color_ids.forEach(color_id => { console.log(`=> ${Video.get_instance().get_color(color_id)}`); });
        }

        // convert an index in the list of palette colors to index in the Video colors
        public get_color_id(palette_color_id: number): number {
                if(palette_color_id <0 || palette_color_id >= this.color_ids.length)
                        return 0;
                return this.color_ids[palette_color_id];
        }
}