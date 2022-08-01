function retconjs_init(): void {
        new Video('retcon', 64, 64, 4);
        Video.start();
}

function retconjs_test(init_func: Function, test_func: Function, interval: number, length: number) {
        retconjs_init();
        console.info(`Test for ${length} seconds`);

        init_func();

        let test = setInterval(test_func, interval);
        setTimeout(() => {
                clearInterval(test);
                retconjs_test_end();
        }, length * 1000);
}

function retconjs_test_clear(): void {
        retconjs_test(() => { Video.get_instance().auto_clear = false; },
                () => { Video.get_instance().clear(color_random()); }, 100, 5);
}

function retconjs_test_pixels(): void {
        retconjs_test(() => { Video.get_instance().auto_clear = false; },
                () => { Video.get_instance().randomize_pixels(); }, 100, 5);
}

function retconjs_test_sprite(): void {
        let sprite: Sprite = new Sprite(8, 8, 1);
        retconjs_test(() => {
                sprite.x = sprite.y = 20;
                Video.get_instance().add_sprite(sprite);
        }, () => {
                sprite.x += Math.floor(Math.random() * 5) - 2;
                sprite.y += Math.floor(Math.random() * 5) - 2;
                sprite.x %= 64;
                sprite.y %= 64;
                console.info(`Position: ${sprite.x}, ${sprite.y}`)
        }, 100, 5);
}

function retconjs_test_end() {
    document.getElementsByTagName('body')[0].innerHTML = "Test concluded. Please refresh to try another test."; 
}

// TODO rename retconjs_render
// TODO better yet, move this back into video and figure out how to handle circular dependency with surface
function render(x: number, y: number, color: Color) {
        Video.get_instance().render(x, y, color);
}
