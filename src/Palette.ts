class Palette {
        private color_ids: Array<number> = new Array<number>;

        constructor(palette_string: string) {
                for (let i = 0; i < palette_string.length; i++) {
                        const ch = palette_string[i];
                        const hex = `0x${ch}`;
                        this.color_ids.push(Number(hex));

                }
                
                this.color_ids.forEach(color => { console.log(`Color ID: ${color}`); });
        }

        // convert an index in the list of palette colors to index in the Video colors
        public get_color_id(palette_color_id: number): number {
                // TODO checking
                return this.color_ids[palette_color_id];
        }
}