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
        console.info("clear to black background");
        Video.set_clear_color(0);
}

function retconjs_test_clear_random(): void {
        console.info("clear to random background color");
        // TODO limit to number of colors in game palette
        Video.set_clear_color(Math.floor(Math.random() * 5));
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
        const video = Video;
        while(video.sprite_count() > 0)
                video.remove_sprite_at(0);
        video.set_clear_color(0);
}

function retconjs_test_pixels(): void {
        console.info("clear to randomized pixels");
        Video.randomize();
}

function retconjs_test_sprite(): Sprite {
        let sprite = new Sprite(1, 0);
        //sprite.pos.x = Math.floor(Math.random() * 64);
        //sprite.pos.y = Math.floor(Math.random() * 64);

        console.info(`Add sprite at ${sprite.pos.x}, ${sprite.pos.y}`);
        Video.add_sprite(sprite);

        return sprite;
}

function retconjs_test_sprite_move_horizontal(): void {
        const sprite = retconjs_test_sprite();

        let move = 0;
        const sprite_move = setInterval(() => {
                move += move_speed;

                if(move < 100) sprite.pos.x += move_speed;
                else sprite.pos.x -= move_speed;
                
                if (move > 200) move = 200;
        }, 1000 / 60);

        console.info(`Test ${sprite_move}: Moving sprite horizontally for ${TEST_LENGTH} seconds`);
        retconjs_set_timeout_sprite_test(sprite, sprite_move);
}

function retconjs_set_timeout_sprite_test(sprite: Sprite, test_id: number) {
        setTimeout(() => {
                Video.remove_sprite(sprite);
                clearInterval(test_id);
                console.info(`Test ${test_id} concluded`);
        }, 1000 * TEST_LENGTH);
}

function retconjs_test_sprite_move_vertical(): void {
        const sprite = retconjs_test_sprite();

        let move = 0;
        const sprite_move = setInterval(() => {
                move += move_speed;

                if(move < 100) sprite.pos.y += move_speed;
                else sprite.pos.y -= move_speed;
                
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
                sprite.pos.x += Math.floor(Math.random() * MOVE_MULT) - move_speed;
                sprite.pos.y += Math.floor(Math.random() * MOVE_MULT) - move_speed;
        }, 1000 / 60);

        console.info(`Test ${sprite_move}: Moving sprite randomly for ${TEST_LENGTH} seconds`);
        retconjs_set_timeout_sprite_test(sprite, sprite_move);
}

function retconjs_test_input(): void {
        const input = new Input();
        console.log("Awaiting input");
}