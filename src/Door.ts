const DOOR_TILE_ID = 1;
const DOOR_OPEN_TILE_ID = 5;
const DOOR_PALETTE_ID = 1; // for doors AND keys

class Door extends Actor {
        public get door_type() { return this.palette_id; }

        private is_open = false;

        constructor(palette_id: number) {
                super(DOOR_TILE_ID, palette_id);
        }

        public override update(dt: number): void {}

        protected override on_collide(other_actor: Actor): void {
                if(this.is_open) return;

                console.debug("Collided with door: " + this.door_type);
                if(other_actor instanceof Player) {
                        console.debug("Colliding thing is player");
                        const player = other_actor as Player;
                        if(player.has_key(this.door_type)) {
                                console.debug("Player has key");
                                player.remove_key(this.door_type);

                                this.is_open = true;
                                this.is_solid = false;
                                this.set_tile(Coord.zero, DOOR_OPEN_TILE_ID);
                        }
                }
        }
}