const DOOR_TILE_ID = 1;
const DOOR_OPEN_TILE_ID = 5;
const DOOR_PALETTE_ID = 1; // for doors AND keys

class Door extends Actor {
        public get door_type() { return this.palette_id; }

        constructor(palette_id: number) {
                console.debug(`door with palette ${palette_id}`);
                super(DOOR_TILE_ID, palette_id);
        }

        protected override on_collide(other_actor: Actor): void {
                console.debug("Collided with door");
                if(other_actor instanceof Player) {
                        console.debug("Colliding thing is player");
                        const player = other_actor as Player;
                        if(player.has_key(this.door_type)) {
                                console.debug("Player has key");
                                player.remove_key(this.door_type);
                                this.is_solid = false;
                                this.set_tile(Coord.zero, DOOR_OPEN_TILE_ID);
                        }
                }
        }
}