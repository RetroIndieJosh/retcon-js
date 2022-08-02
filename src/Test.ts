// RetConJS tests

let move_speed = 1;

function retconjs_test_decrease_move_speed() {
        move_speed -= 1;
}

function retconjs_test_increase_move_speed() {
        move_speed += 1;
}

function retconjs_test_clear_black(): void {
        console.info("Clear to black");
        Video.get_instance().set_clear_color("#000");
}

function retconjs_test_clear_random(): void {
        console.info("clear to random colors");
        Video.get_instance().set_clear_color(color_random());
}


function retconjs_test_clear_sprites(): void {
        const video = Video.get_instance();
        while(video.sprite_count() > 0)
                video.remove_sprite_at(0);
        video.set_clear_color("#000");
}

function retconjs_test_pixels(): void {
        console.info("clear to randomized pixels");
        Video.get_instance().randomize_pixels();
}

function retconjs_test_sprite(): Sprite {
        let sprite: Sprite = new Sprite(0, 0);
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
                move += move_speed;

                if(move < 100) sprite.x += move_speed;
                else sprite.x -= move_speed;
                
                if (move > 200) move = 200;
        }, 1000 / 60);

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
                move += move_speed;

                if(move < 100) sprite.y += move_speed;
                else sprite.y -= move_speed;
                
                if (move > 200) move = 200;
        }, 1000 / 60);

        setTimeout(() => {
                Video.get_instance().remove_sprite(sprite);
                clearInterval(sprite_move);
        }, TEST_LENGTH * 1000);
}

function retconjs_test_sprite_move_random(): void {
        const TEST_LENGTH = 5;

        const sprite = retconjs_test_sprite();

        console.info(`Moving sprite randomly for ${TEST_LENGTH} seconds`);
        const MOVE_MULT = move_speed * 2 + 1;
        let move = 0;
        const sprite_move = setInterval(() => {
                sprite.x += Math.floor(Math.random() * MOVE_MULT) - move_speed;
                sprite.y += Math.floor(Math.random() * MOVE_MULT) - move_speed;
        }, 1000 / 60);

        setTimeout(() => {
                Video.get_instance().remove_sprite(sprite);
                clearInterval(sprite_move);
        }, TEST_LENGTH * 1000);
}