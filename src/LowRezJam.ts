// TODO move to math
const invsqrt2 = 1/Math.sqrt(2);

//const player_speed = 0.5;
const player_speed = 1;

// TODO static?
class LowRezJam {
        private static instance: LowRezJam;

        private actors: Array<Actor>;
        private player: Actor;

        // TODO game path
        public static init(): void {
                retconjs_init(8, "game/lowrezjam.json", () => new LowRezJam());

                Video.add_frame_event(LowRezJam.update);
        }

        constructor() {
                if(LowRezJam.instance != undefined) 
                        throw new Error("Only one game allowed!");

                // initialize objects

                this.actors = new Array<Actor>();

                this.player = new Actor(3, 1, this.check_solid);
                this.player.pos = new Coord(28, 28);
                this.actors.push(this.player);

                const door_count = 4;
                for(let i = 0; i < door_count; i++) {
                        const door = new Actor(1, 1, this.check_solid);

                        const x = random_int(0, 8) * 8;
                        const y = random_int(0, 8) * 8;
                        door.pos = new Coord(x, y);

                        console.debug(`Add door at ${door.pos}`);

                        this.actors.push(door);
                }

                LowRezJam.instance = this;
        }

        private check_solid(actor: Actor) {
                var is_solid = false;

                LowRezJam.instance.actors.forEach(other_actor => {
                        if(other_actor == actor)  {
                                return;
                        }

                        if(other_actor.collides_with(actor))  {
                                console.debug("is solid");
                                is_solid = true;
                        }
                })

                console.debug(`solid = ${is_solid}`);
                return is_solid;
        }

        private static update(dt: number): void {
                const game = LowRezJam.instance;
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

                move.scale_square(player_speed);
                game.player.move(move);
        }
}