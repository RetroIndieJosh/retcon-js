const DOOR_TILE_ID = 1;
const DOOR_OPEN_TILE_ID = 2;
const DOOR_PALETTE_ID = 1; // for doors AND keys

class Door extends Actor {
        private _color_id: number;
        public get color_id() { return this._color_id; }

        constructor(color_id: number) {
                super(DOOR_TILE_ID, DOOR_PALETTE_ID);
                this._color_id = color_id;
        }

        protected override on_collide(other_actor: Actor): void {
                console.debug("Collided with door");
                if(other_actor instanceof Player) {
                        console.debug("Colliding thing is player");
                        const player = other_actor as Player;
                        if(player.has_key(this._color_id)) {
                                console.debug("Player has key");
                                player.remove_key(this._color_id);
                                this.is_solid = false;
                                this.set_tile(Coord.zero, DOOR_OPEN_TILE_ID);
                        }
                }
        }
}