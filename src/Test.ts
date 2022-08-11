// rcj tests

// TODO do game setup in here specifically for testing purposes

const TEST_LENGTH = 15;
let move_speed = 1;

let fail_count = 0;

// expect an exception
function rcj_assert_exception(func: () => void) {
        try { func(); }
        catch (ex) { return; }
        rcj_assert_equals("exception", "no exception");
}

function rcj_assert_false(actual: boolean): boolean {
        return rcj_assert_equals(false, actual);
}

function rcj_assert_true(actual: boolean): boolean {
        return rcj_assert_equals(true, actual);
}

function rcj_assert_equals<T>(expected: T, actual: T): boolean {
        if (expected == actual) return true;

        console.error(`Assertion failed: Expected value ${expected}, actual ${actual}`);
        fail_count++;
        return false;
}

function rcj_unit_tests() {
        fail_count = 0;

        rcj_test_coord();
        rcj_test_numbergrid();
        rcj_test_surface();
        rcj_test_tile();
        rcj_test_sprite();

        if (fail_count == 0) console.log("All tests succeeded!");
        else console.log(`${fail_count} failed test(s)`);
}

function rcj_test_decrease_move_speed() {
        move_speed -= 1;
}

function rcj_test_increase_move_speed() {
        move_speed += 1;
}

function rcj_test_clear_default(): void {
        console.info("clear to color 0 (default)");
        Video.set_clear_color(0);
}

function rcj_test_clear_random(): void {
        const color_id = Math.floor(Math.random() * Video.color_count);
        console.info("clear to random background color " + `(${color_id})`);
        Video.set_clear_color(color_id);
}

function rcj_test_metronome(): void {
        metronome_init();
        metronome_play();
}

function rcj_test_music(): void {
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

function genRanHex(digits: number): string {
        return [...Array(digits)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}


function rcj_test_add_color(): void {
        const color_str = genRanHex(3);
        const index = Video.add_color(color_str);

        console.debug(`add color #${index} = 0x${color_str}`);
}

function rcj_test_add_palette(): void {
        let pal_str = "";
        for (let i = 0; i < Video.palette_color_count; i++)
                pal_str += Math.floor(Math.random() * Video.color_count);

        const index = Video.add_palette(new Palette(pal_str));
        console.debug(`add palette ${index} = "${pal_str}"`);
}

// TODO move (utilities?)
// returns random int in range [min, max)
function random_int(min: number, max: number) {
        return Math.floor(Math.random() * max + min);
}

function rcj_test_add_sprite(): Sprite | null {
        if (Video.palette_count == 0) {
                console.debug("Cannot add sprite - no palettes loaded");
                return null;
        }

        if (Video.tile_count == 0) {
                console.debug("Cannot add sprite - no tiles loaded");
                return null;
        }

        const tile_id = random_int(0, Video.tile_count);
        const palette_id = random_int(0, Video.palette_count);

        const sprite = new Sprite(tile_id, palette_id);
        sprite.pos.x = random_int(0, 64);
        sprite.pos.y = random_int(0, 64);

        const index = Video.add_sprite(sprite);
        console.info(`Add sprite ${index} at ${sprite.pos.x}, ${sprite.pos.y}`);

        return sprite;
}

function rcj_test_add_tile(): void {
        let tile_str = "";
        for (let i = 0; i < 8 * 8; i++) {
                tile_str += Math.floor(Math.random() * Video.palette_color_count);
        }

        const index = Video.add_tile(new Tile(tile_str));
        console.debug(`add tile #${index}`);
}

function rcj_test_clear_sprites(): void {
        const video = Video;
        while(video.sprite_count > 0)
                video.remove_sprite_at(0);
        video.set_clear_color(0);
}

function rcj_test_init_random_game(): void {
        for (let i = 0; i < 8; i++) rcj_test_add_color();
        for (let i = 0; i < 8; i++) rcj_test_add_palette();
        for (let i = 0; i < 8; i++) rcj_test_add_tile();
}

function rcj_test_pixels(): void {
        console.info("clear to randomized pixels");
        Video.randomize();
}

function rcj_test_sprite_move_horizontal(): void {
        const sprite = rcj_test_add_sprite();
        if (sprite == null) return;

        let move = 0;
        const sprite_move = setInterval(() => {
                move += move_speed;

                if(move < 100) sprite.pos.x += move_speed;
                else sprite.pos.x -= move_speed;
                
                if (move > 200) move = 200;
        }, 1000 / 60);

        console.info(`Test ${sprite_move}: Moving sprite horizontally for ${TEST_LENGTH} seconds`);
        rcj_set_timeout_sprite_test(sprite, sprite_move);
}

function rcj_set_timeout_sprite_test(sprite: Sprite, test_id: number) {
        setTimeout(() => {
                Video.remove_sprite(sprite);
                clearInterval(test_id);
                console.info(`Test ${test_id} concluded`);
        }, 1000 * TEST_LENGTH);
}

function rcj_test_sprite_move_vertical(): void {
        const sprite = rcj_test_add_sprite();
        if (sprite == null) return;

        let move = 0;
        const sprite_move = setInterval(() => {
                move += move_speed;

                if(move < 100) sprite.pos.y += move_speed;
                else sprite.pos.y -= move_speed;
                
                if (move > 200) move = 200;
        }, 1000 / 60);

        console.info(`Test ${sprite_move}: Moving sprite vertically for ${TEST_LENGTH} seconds`);
        rcj_set_timeout_sprite_test(sprite, sprite_move);
}

function rcj_test_sprite_move_random(): void {
        const sprite = rcj_test_add_sprite();
        if (sprite == null) return;

        const MOVE_MULT = move_speed * 2 + 1;
        let move = 0;
        const sprite_move = setInterval(() => {
                sprite.pos.x += Math.floor(Math.random() * MOVE_MULT) - move_speed;
                sprite.pos.y += Math.floor(Math.random() * MOVE_MULT) - move_speed;
        }, 1000 / 60);

        console.info(`Test ${sprite_move}: Moving sprite randomly for ${TEST_LENGTH} seconds`);
        rcj_set_timeout_sprite_test(sprite, sprite_move);
}

function rcj_test_input(): void {
        const input = new Input();
        console.log("Awaiting input");
}