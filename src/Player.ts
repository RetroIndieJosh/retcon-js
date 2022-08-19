const PLAYER_SPEED = 0.5;
//const player_speed = 1;

const PLAYER_PALETTE_ID = 2;
const PLAYER_TILE_ID = 3;

class Player extends Actor {
        private keys = new Array<number>;

        constructor() {
                super(PLAYER_TILE_ID, PLAYER_PALETTE_ID);
        }

        public add_key(door_type: number) {
                this.keys.push(door_type);
        }

        public has_key(door_type: number) : boolean {
                return this.keys.indexOf(door_type) != -1;
        }

        public remove_key(door_type: number) : void {
                const index = this.keys.indexOf(door_type);
                if(index == -1) {
                        console.warn(`Tried to remove key player doesn't have (${door_type})`);
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
                        move.scale_square(INVSQRT2);

                move.scale_square(PLAYER_SPEED);
                this.move(move);
        }

        protected on_collide(other_actor: Actor): void {
        }
}