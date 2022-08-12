const DOOR_TILE_ID = 1;
const DOOR_PALETTE_ID = 1; // for doors AND keys

class Door extends Actor {
        private _color_id: number;
        public get color_id() { return this._color_id; }

        constructor(color_id: number, check_solid: (actor: Actor) => boolean) {
                super(DOOR_TILE_ID, DOOR_PALETTE_ID, check_solid);
                this._color_id = color_id;
        }

        protected override on_collide(other_actor: Actor): void {
        }
}