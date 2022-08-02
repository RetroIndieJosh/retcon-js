class GameData {
        public title: string = "";
        public palettes: Array<string> = new Array<string>();
        public tiles: Array<string> = new Array<string>();
        public tilesets: Array<string> = new Array<string>();
        public tilemaps: Array<string> = new Array<string>();
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