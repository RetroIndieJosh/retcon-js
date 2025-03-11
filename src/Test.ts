// RetConJS tests

// TODO do game setup in here specifically for testing purposes

const TEST_LENGTH = 15;
let move_speed = 1;

function retconjs_test_decrease_move_speed() {
        move_speed -= 1;
}

function retconjs_test_increase_move_speed() {
        move_speed += 1;
}

function retconjs_test_clear_black(): void {
        console.info("Clear background (tile 0)");
        Video.get_instance().set_bg_all(0, 0);
}

function retconjs_test_clear_random(): void {
        const color_id = Math.floor(Math.random() * 5);
        const color = Video.get_instance().get_color(color_id);
        console.info(`clear to color #${color_id} (${color})`);
        // TODO limit to number of colors in game palette
        Video.get_instance().set_clear_color(color_id);
}

function retconjs_test_metronome(): void {
        metronome_init();
        metronome_play();
}

function retconjs_test_music(): void {
        const drums = new Audio("./music/replicator-drum.ogg");
        drums.loop = true;

        const acid = new Audio("./music/replicator-acid.ogg");
        acid.loop = true;

        const pad = new Audio("./music/replicator-pad.ogg");
        pad.loop = true;

        // TODO these loops only work if all the patterns are the same length (but awkward pause at the end)
        drums.addEventListener("canplaythrough", (event) => {
                drums.play();
                pad.play();
                acid.play();
        });
}

function retconjs_test_clear_sprites(): void {
        const video = Video.get_instance();
        while(video.sprite_count() > 0)
                video.remove_sprite_at(0);
        video.set_clear_color(0);
}

function retconjs_test_pixels(): void {
        console.info("clear to randomized pixels");
        Video.get_instance().randomize_pixels();
}

function retconjs_test_sprite(): Sprite {
        let sprite: Sprite = new Sprite(1, 0);
        sprite.x = Math.floor(Math.random() * 64);
        sprite.y = Math.floor(Math.random() * 64);

        console.info(`Add sprite at ${sprite.x}, ${sprite.y}`);
        Video.get_instance().add_sprite(sprite);

        return sprite;
}

function retconjs_test_sprite_move_horizontal(): void {
        const sprite = retconjs_test_sprite();

        let move = 0;
        const sprite_move = setInterval(() => {
                move += move_speed;

                if(move < 100) sprite.x += move_speed;
                else sprite.x -= move_speed;
                
                if (move > 200) move = 200;
        }, 1000 / 60);

        console.info(`Test ${sprite_move}: Moving sprite horizontally for ${TEST_LENGTH} seconds`);
        retconjs_set_timeout_sprite_test(sprite, sprite_move);
}

function retconjs_set_timeout_sprite_test(sprite: Sprite, test_id: number) {
        setTimeout(() => {
                Video.get_instance().remove_sprite(sprite);
                clearInterval(test_id);
                console.info(`Test ${test_id} concluded`);
        }, 1000 * TEST_LENGTH);
}

function retconjs_test_sprite_move_vertical(): void {
        const sprite = retconjs_test_sprite();

        let move = 0;
        const sprite_move = setInterval(() => {
                move += move_speed;

                if(move < 100) sprite.y += move_speed;
                else sprite.y -= move_speed;
                
                if (move > 200) move = 200;
        }, 1000 / 60);

        console.info(`Test ${sprite_move}: Moving sprite vertically for ${TEST_LENGTH} seconds`);
        retconjs_set_timeout_sprite_test(sprite, sprite_move);
}

function retconjs_test_sprite_move_random(): void {
        const sprite = retconjs_test_sprite();

        const MOVE_MULT = move_speed * 2 + 1;
        let move = 0;
        const sprite_move = setInterval(() => {
                sprite.x += Math.floor(Math.random() * MOVE_MULT) - move_speed;
                sprite.y += Math.floor(Math.random() * MOVE_MULT) - move_speed;
        }, 1000 / 60);

        console.info(`Test ${sprite_move}: Moving sprite randomly for ${TEST_LENGTH} seconds`);
        retconjs_set_timeout_sprite_test(sprite, sprite_move);
}

function retconjs_test_input(): void {
        const input = new Input();
        console.log("Awaiting input");
}