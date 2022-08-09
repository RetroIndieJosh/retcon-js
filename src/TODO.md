# LOWREZJAM 2022 To Do
 
## Engine

- change all backend stuff to use Coord type
- `add_frame_event` instead of having input update in Video
  - frame management independent of video (refreshing is a frame event)
- use text for the viewers to draw the corresponding index
  - will want something like `get_center` and `get_real_center` where the latter is screen coords converted using Video.scale
- migrate Actor to its own file and incorporate update in engine
- AABB collision
- pixel collision: do AABB first, then pixel to check exact

## Minimum Viable

- set up doors and player as sprites
- add keys (sprites) that player can pickup
- keys open (destroy) doors with matching color (and are themselves destroyed)
- pause menu to show all currently held keys
- special item to pick up to win the game
- hard-coded tilemap mazes with a well thought out order

## Wishlist - Game

- switches activated by touching
- projectile weapon that activates distant switches
  - "windows" you can shoot but not walk through
- enemies to avoid
- kill enemies with projectiles
- limited projectile ammo + ammo pickups (enemy drops)
- some other destructible non-hostile thing that drops ammo (like zelda pots)
- currency
- shop that converts currency to ammo
- randomizer that shuffles the locations of all keys+items but not doors, and makes sure it's still beatable

## Wishlist - Engine

- `game.json` maps to color, palette, tile, tilemap (map), sprite, actor, etc. files
  - python tool to compile `game.json` and all included files into a binary `game.rcg` (rcg = RetCon Game)
- tile viewer
- sprite viewer
- palette viewer
- tilemap viewer
