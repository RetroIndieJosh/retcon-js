type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

type Color = RGB | RGBA | HEX;

function color_random(include_alpha: boolean = false): Color {
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);

        if (include_alpha) {
                let a = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, ${a})`;
        }

        return `rgb(${r}, ${g}, ${b})`;
}

class Palette {
        constructor(filename: string) {
        }
}