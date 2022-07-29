function draw()
{
        const video = new Video('retcon', 64, 64, 4);
        video.draw();
}

function random_color()
{
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return `rgb(${r}, ${g}, ${b}`;
}