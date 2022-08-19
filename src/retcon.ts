// TODO fix clear random / clear color not working

class SizedDataBase {
        public width = -1;
        public height = -1;
}

class TileDataBase extends SizedDataBase {
        public tiles = "";
}

class TilemapData extends TileDataBase {
        public palette = -1;
        public tileset = -1;
}

class ActorData extends TileDataBase { }

// TODO write separate software (Python?) compiler that converts .map, .set, .tile, and .pal files into json, then retcon reads that json file
class GameData {
        public title = "";
        public tile_size = 8;

        public colors = "";
        public palettes = new Array<string>();

        public tiles = new Array<string>();
        public tilesets = new Array<string>();
        public tilemaps = new Array<TilemapData>();
}

function retconjs_init(scale: number, game_path: string | null = null,  on_done: () => void, debug = false): void {
        if (game_path == null) return;

        fetch(game_path)
                .then(res => res.json())
                .then(res => retconjs_load_game(res, scale, debug))
                .then(_ => {
                        if (on_done != null) on_done()
                });
}

function retconjs_load_game(game_data: GameData, scale: number, debug: boolean) {
        Video.initialize('retcon', new Coord(64, 64), scale, game_data.colors);

        Game.initialize(game_data);

        // load tilemap background
        /*
        const tiles = new Tilemap(8, 8, 8, 1);
        video.add_background(tiles);
        tiles.set_all(0);
        */

        Input.initialize();
        Video.start();

        console.debug(`Starting game ${game_data.title} with:\n`
                + `${Video.color_count} colors\n`
                + `${game_data.palettes.length} palettes\n`
                + `${game_data.tiles.length} tiles\n`
                + `${game_data.tilesets.length} tilesets\n`
                + `${game_data.tilemaps.length} tilemaps\n`
        );

        if(!debug) return;

        setInterval(() => {
                let sprite_count_element = document.getElementById("sprite-count");
                if(sprite_count_element == null) return;
                sprite_count_element.innerHTML = `${Video.sprite_count}`;

                let move_speed_element = document.getElementById("move-speed");
                if(move_speed_element == null) return;
                move_speed_element.innerHTML = `${move_speed}`;
        }, 1000 / 60);
}