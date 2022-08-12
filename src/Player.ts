const PLAYER_SPEED = 0.5;
//const player_speed = 1;

const PLAYER_PALETTE_ID = 2;
const PLAYER_TILE_ID = 3;

class Player extends Actor {
        constructor(check_solid: (actor: Actor) => boolean) {
                super(PLAYER_TILE_ID, PLAYER_PALETTE_ID, check_solid);
        }

        public override update(dt: number): void {
                let move = Coord.zero;

                if(Input.is_key_down("ArrowLeft") || Input.is_key_down("a"))
                        move.add(Coord.left);
                else if(Input.is_key_down("ArrowRight") || Input.is_key_down("d"))
                        move.add(Coord.right);

                if(Input.is_key_down("ArrowUp") || Input.is_key_down("w"))
                        move.add(Coord.up);
                else if(Input.is_key_down("ArrowDown") || Input.is_key_down("s"))
                        move.add(Coord.down);

                if(move.x != 0 && move.y != 0) 
                        move.scale_square(invsqrt2);

                move.scale_square(PLAYER_SPEED);
                this.move(move);
        }
}