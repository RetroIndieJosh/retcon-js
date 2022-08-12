// TODO move to math
const invsqrt2 = 1/Math.sqrt(2);

const WALL_PALETTE_ID = 0;
const WALL_TILE_ID = 4;


// TODO static?
class LowRezJam {
        private static instance: LowRezJam;

        private actors: Array<Actor>;
        private player: Actor;

        public static init(): void {
                retconjs_init(8, "game/lowrezjam.json", () => new LowRezJam());
        }

        constructor() {
                if(LowRezJam.instance != undefined) 
                        throw new Error("Only one game allowed!");

                this.actors = new Array<Actor>();

                // init player
                this.player = new Player(this.check_solid);
                this.player.pos = new Coord(28, 28);
                this.actors.push(this.player);

                // init walls
                for(let pos = new Coord(0, 0); pos.x < 8; pos.x++) {
                        for(pos.y = 0; pos.y < 8; pos.y++) {
                                if(pos.x == 0 || pos.x == 7 || pos.y == 0 || pos.y == 7) {
                                        const wall = new Actor(WALL_TILE_ID, WALL_PALETTE_ID, this.check_solid);
                                        wall.pos = pos.times_square(8);
                                        this.actors.push(wall);
                                }
                        }
                }

                // init doors
                const door_count = 4;
                for(let i = 0; i < door_count; i++) {
                        const door = new Door(1, this.check_solid);

                        const x = random_int(0, 8) * 8;
                        const y = random_int(0, 8) * 8;
                        door.pos = new Coord(x, y);

                        console.debug(`Add door at ${door.pos}`);

                        this.actors.push(door);
                }

                Video.add_frame_event(this.update_actors);

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

        private update_actors(dt: number) {
                LowRezJam.instance.actors.forEach(actor => actor.update(dt));
        }
}