function retconjs_init(): void
{
        new Video('retcon', 64, 64, 4);
        Video.start();

        let sprite: Sprite = new Sprite(8, 8, 1);
        sprite.x = sprite.y = 20;
        Video.get_instance().add_sprite(sprite);
        setInterval(function () {
                sprite.x += Math.floor(Math.random() * 5) - 2;
                sprite.y += Math.floor(Math.random() * 5) - 2;
                sprite.x %= 64;
                sprite.y %= 64;
                console.info(`Position: ${sprite.x}, ${sprite.y}`)
        }, 1000);
}

function render(x: number, y: number, color: Color) {
        Video.get_instance().render(x, y, color);
}
