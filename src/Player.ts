const PLAYER_SPEED = 0.5;
//const player_speed = 1;

const PLAYER_PALETTE_ID = 2;
const PLAYER_TILE_ID = 3;

class Player extends Actor {
        private keys = new Array<number>;

        constructor() {
                super(PLAYER_TILE_ID, PLAYER_PALETTE_ID);
        }

        public add_key(color_id: number) {
                this.keys.push(color_id);
        }

        public has_key(color_id: number) : boolean {
                return this.keys.indexOf(color_id) != -1;
        }

        public remove_key(color_id: number) : void {
                const index = this.keys.indexOf(color_id);
                if(index == -1) {
                        console.warn(`Tried to remove key player doesn't have (${color_id})`);
                        return;
                }
                this.keys.splice(index, 1);
        }

        public override update(dt: number): void {
                let move = Coord.zero;

                if((!LowRezJam.ITCH_RELEASE && Input.is_key_down("ArrowLeft")) || Input.is_key_down("a"))
                        move.add(Coord.left);
                else if((!LowRezJam.ITCH_RELEASE && Input.is_key_down("ArrowRight")) || Input.is_key_down("d"))
                        move.add(Coord.right);

                if((!LowRezJam.ITCH_RELEASE && Input.is_key_down("ArrowUp")) || Input.is_key_down("w"))
                        move.add(Coord.up);
                else if((!LowRezJam.ITCH_RELEASE && Input.is_key_down("ArrowDown")) || Input.is_key_down("s"))
                        move.add(Coord.down);

                if(move.x != 0 && move.y != 0) 
                        move.scale_square(invsqrt2);

                move.scale_square(PLAYER_SPEED);
                this.move(move);
        }
}