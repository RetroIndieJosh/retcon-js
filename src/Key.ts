const KEY_TILE_ID = 2;

class Key extends Actor {
        public get door_type() { return this.palette_id; }

        constructor(palette_id: number) {
                super(KEY_TILE_ID, palette_id);
        }

        protected override on_collide(other_actor: Actor): void {
                console.debug("Collided with key: " + this.door_type);
                if(other_actor instanceof Player) {
                        console.debug("Colliding thing is player");
                        const player = other_actor as Player;
                        player.add_key(this.door_type);
                        this.destroy();
                }
        }
}