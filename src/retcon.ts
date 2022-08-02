class IdDataBase {
        public id: number = -1;
}

class SizedDataBase extends IdDataBase {
        public width: number = -1;
        public height: number = -1;
}

class TileDataBase extends SizedDataBase {
        public tiles: string = "";
}

class TileData extends IdDataBase {
        public pixels: string = "";
}

class TilesetData extends TileDataBase { }

class TilemapData extends TileDataBase {
        public palette: number = -1;
        public tileset: number = -1;
}

class ActorData extends TileDataBase { }

class PaletteData extends IdDataBase {
        public color_count: number = -1;
        public colors: string = "";

}

// TODO write separate software (Python?) compiler that converts .map, .set, .tile, and .pal files into json, then retcon reads that json file
class GameData {
        public title: string = "";
        public colors: string = "";
        public palettes: Array<PaletteData> = new Array<PaletteData>();
        public tiles: Array<TileData> = new Array<TileData>();
        public tilesets: Array<TilesetData> = new Array<TilesetData>();
        public tilemaps: Array<TilemapData> = new Array<TilemapData>();
}

const background: Surface = new Surface(256, 256);

function retconjs_init(scale: number, debug: boolean = false): void {
        fetch("./game/sample.json").then(res => res.json()).then(res => retconjs_load_game(res, scale, debug));
}

function retconjs_load_game(game_data: GameData, scale: number, debug: boolean) {
        const video = new Video('retcon', 64, 64, scale, game_data.colors);
        //video.add_background(background);
        Video.start();

        game_data.palettes.forEach(palette_data => {
                new Palette(palette_data.colors);
        });

        if(!debug) return;

        console.info(`Starting game ${game_data.title} with:\n`
                + `${Video.get_instance().color_count()} colors\n`
                + `${game_data.palettes.length} palettes\n`
                + `${game_data.tiles.length} tiles\n`
                + `${game_data.tilesets.length} tilesets\n`
                + `${game_data.tilemaps.length} tilemaps\n`
        );

        setInterval(() => {
                let sprite_count_element = document.getElementById("sprite-count");
                if(sprite_count_element == null) return;
                sprite_count_element.innerHTML = `${Video.get_instance().sprite_count()}`;

                let move_speed_element = document.getElementById("move-speed");
                if(move_speed_element == null) return;
                move_speed_element.innerHTML = `${move_speed}`;
        }, 1000 / 60);
}