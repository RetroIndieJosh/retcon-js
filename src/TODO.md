# LOWREZJAM 2022 To Do

## Standards

- only floor `number`s if using as array index (don't bother when passing to function - that function should handle it)
- always use NumberGrid for `Array<Number><Number>` (automagically handles clip and dirty - and will later handle wrap)
 
## Engine

- add random background (generate tilemap and add to background list)
- visualize colors (display all in sequence)
- visualize palettes (display all in sequence)
- visualize tiles (display all in sequence)
- unit tests for Sprite, TileMap, Video
- ToString or Log for Coord type
- `call_after_frames(callback, frame_count)` calls the callback after frame_count frames have elapsed
- `call_for_frames(callback, frame_count)` calls the callback every frame for frame_count frames
- use text for the viewers to draw the corresponding index
  - will want something like `get_center` and `get_real_center` where the latter is screen coords converted using Video.scale
- migrate Actor to its own file and incorporate update in engine
- pixel collision: do AABB first, then pixel to check exact (can be based on color or a tile used as a mask with only 0/1)

## Minimum Viable

- set up doors and player as sprites
- add keys (sprites) that player can pickup
- keys open (destroy) doors with matching color (and are themselves destroyed)
- pause menu to show all currently held keys
- special item to pick up to win the game
- travel between rooms (screens)
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

- organize files into subdirectories (do they flatten on compile?)
- `game.json` maps to color, palette, tile, tilemap (map), sprite, actor, etc. files
  - python tool to compile `game.json` and all included files into a binary `game.rcg` (rcg = RetCon Game)
- tile viewer
- sprite viewer
- palette viewer
- tilemap viewer
- music looping with metronome to avoid dead air
- audio layering system with metronome to keep in sync
