function retconjs_init(scale: number, debug: boolean = false): void {
        new Video('retcon', 64, 64, scale);
        Video.start();

        if(!debug) return;

        setInterval(() => {
                let sprite_count = document.getElementById("sprite-count");
                if(sprite_count == null) return;
                sprite_count.innerHTML = `${Video.get_instance().sprite_count()}`;
        }, 1000 / 60);
}

function retconjs_test_clear(): void {
        Video.get_instance().auto_clear = false;

        console.info("Clear to black");
        Video.get_instance().clear("#000");
}

function retconjs_test_clear_sprites(): void {
        while(Video.get_instance().sprite_count() > 0)
                Video.get_instance().remove_sprite_at(0);
}

function retconjs_test_pixels(): void {
        Video.get_instance().auto_clear = false;

        console.info("Clear to randomized pixels");
        Video.get_instance().randomize_pixels();
}

function retconjs_test_sprite(): Sprite {
        Video.get_instance().auto_clear = true;

        let sprite: Sprite = new Sprite(8, 8, 1);
        sprite.x = Math.floor(Math.random() * 64);
        sprite.y = Math.floor(Math.random() * 64);

        console.info(`Add sprite at ${sprite.x}, ${sprite.y}`);
        Video.get_instance().add_sprite(sprite);

        return sprite;
}

function retconjs_test_sprite_move_horizontal(): void {
        const TEST_LENGTH = 5;

        const sprite = retconjs_test_sprite();

        console.info(`Moving sprite horizontally for ${TEST_LENGTH} seconds`);
        let move = 0;
        const sprite_move = setInterval(() => {
                move += 4;

                if(move < 100) sprite.x += 4;
                else sprite.x -= 4;
                
                if (move > 200) move = 200;
        }, 100);

        setTimeout(() => {
                Video.get_instance().remove_sprite(sprite);
                clearInterval(sprite_move);
        }, TEST_LENGTH * 1000);
}

function retconjs_test_sprite_move_vertical(): void {
        const TEST_LENGTH = 5;

        const sprite = retconjs_test_sprite();

        console.info(`Moving sprite vertically for ${TEST_LENGTH} seconds`);
        let move = 0;
        const sprite_move = setInterval(() => {
                move += 4;

                if(move < 100) sprite.y += 4;
                else sprite.y -= 4;
                
                if (move > 200) move = 200;
        }, 100);

        setTimeout(() => {
                Video.get_instance().remove_sprite(sprite);
                clearInterval(sprite_move);
        }, TEST_LENGTH * 1000);
}

function retconjs_test_sprite_move_random(): void {
        const TEST_LENGTH = 5;

        const sprite = retconjs_test_sprite();

        console.info(`Moving sprite randomly for ${TEST_LENGTH} seconds`);
        let move = 0;
        const sprite_move = setInterval(() => {
                sprite.x += Math.floor(Math.random() * 8) - 4;
                sprite.y += Math.floor(Math.random() * 8) - 4;
        }, 100);

        setTimeout(() => {
                Video.get_instance().remove_sprite(sprite);
                clearInterval(sprite_move);
        }, TEST_LENGTH * 1000);
}

// TODO rename retconjs_render
// TODO better yet, move this back into video and figure out how to handle circular dependency with surface
function render(x: number, y: number, color: Color) {
        Video.get_instance().render(x, y, color);
}
