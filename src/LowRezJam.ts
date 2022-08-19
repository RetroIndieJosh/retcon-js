const WALL_PALETTE_ID = 0;
const WALL_TILE_ID = 4;

const DOOR_PALETTE_MIN = 2;
const DOOR_PALETTE_MAX = 4;

class Wall extends Actor {
        public override update(dt: number): void { }
        protected override on_collide(other_actor: Actor): void { }
}

// TODO static?
class LowRezJam {
        private static instance: LowRezJam;

        // TODO adjust this so we can toggle among wasd, arrows, or both
        public static ITCH_RELEASE = false;

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
                this.player = new Player();
                this.player.pos = new Coord(9, 9);
                this.actors.push(this.player);

                // init walls
                for(let pos = new Coord(0, 0); pos.x < 8; pos.x++) {
                        for(pos.y = 0; pos.y < 8; pos.y++) {
                                if(pos.x == 0 || pos.x == 7 || pos.y == 0 || pos.y == 7) {
                                        const wall = new Wall(WALL_TILE_ID, WALL_PALETTE_ID);
                                        wall.pos = pos.times_square(8);
                                        this.actors.push(wall);
                                }
                        }
                }

                // init doors
                const door_count = 4;
                for(let i = 0; i < door_count; i++) {
                        const door = new Door(random_int(DOOR_PALETTE_MIN, DOOR_PALETTE_MAX+1));

                        const x = random_int(2, 7) * 8;
                        const y = random_int(2, 7) * 8;
                        door.pos = new Coord(x, y);

                        console.debug(`Add door at ${door.pos}`);

                        this.actors.push(door);
                }

                // init keys
                const key_count = 4;
                for(let i = 0; i < door_count; i++) {
                        const key = new Key(random_int(DOOR_PALETTE_MIN, DOOR_PALETTE_MAX+1));

                        const x = random_int(2, 7) * 8;
                        const y = random_int(2, 7) * 8;
                        key.pos = new Coord(x, y);

                        console.debug(`Add door at ${key.pos}`);

                        this.actors.push(key);
                }

                Actor.check_solid = this.check_solid;
                Video.add_frame_event(this.update_actors);

                LowRezJam.instance = this;
        }

        private check_solid(actor: Actor): Actor | null {
                for(let i = 0; i < LowRezJam.instance.actors.length; i++) {
                        const other_actor = LowRezJam.instance.actors[i];
                        if(other_actor == actor)  {
                                continue;
                        }

                        if(other_actor.collides_with(actor))  {
                                console.debug("is solid");
                                return other_actor;
                        }
                }

                return null;
        }

        private update_actors(dt: number) {
                LowRezJam.instance.actors.forEach(actor => actor.update(dt));
                LowRezJam.instance.actors = LowRezJam.instance.actors.filter(actor => !actor.marked_for_deletion);
        }
}