// a sprite is a Surface with a position
class Sprite extends Surface {
        public x: number = 0;
        public y: number = 0;

        // TODO change to draw and override
        public draw_sprite(surface: Surface) {
                this.blit(surface, this.x, this.y);
        }
}