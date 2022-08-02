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
        public palettes: Array<PaletteData> = new Array<PaletteData>();
        public tiles: Array<TileData> = new Array<TileData>();
        public tilesets: Array<TilesetData> = new Array<TilesetData>();
        public tilemaps: Array<TilemapData> = new Array<TilemapData>();
}

function retconjs_init(scale: number, debug: boolean = false): void {
        new Video('retcon', 64, 64, scale);
        Video.start();

        fetch("./game/sample.json").then(res => res.json()).then(res => retconjs_load_game(res, debug));
}

function retconjs_load_game(game_data: GameData, debug: boolean) {
        console.info(`Starting game ${game_data.title} with:\n`
                + `${game_data.palettes.length} palettes\n`
                + `${game_data.tiles.length} tiles\n`
                + `${game_data.tilesets.length} tilesets\n`
                + `${game_data.tilemaps.length} tilemaps\n`
        );

        if(!debug) return;

        setInterval(() => {
                let sprite_count_element = document.getElementById("sprite-count");
                if(sprite_count_element == null) return;
                sprite_count_element.innerHTML = `${Video.get_instance().sprite_count()}`;

                let move_speed_element = document.getElementById("move-speed");
                if(move_speed_element == null) return;
                move_speed_element.innerHTML = `${move_speed}`;
        }, 1000 / 60);
}

// TODO rename retconjs_render
// TODO better yet, move this back into video and figure out how to handle circular dependency with surface
function render(x: number, y: number, color: Color) {
        Video.get_instance().render(x, y, color);
}