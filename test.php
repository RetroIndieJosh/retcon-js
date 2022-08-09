<!DOCTYPE html>
<html>

<head>
        <link rel="stylesheet" href="main.css">
        <meta charset="utf-8" />
        <title>retcon.js - tests</title>
</head>

<!--TODO this should be test.json-->
<body onload="retconjs_init(5, 'game/sample.json', null, true);">
        <h1 style="text-align:center;">RetConJS Testing</h1>
        <div class="menu-container">
                <div class="button-container">
                        <button onclick="rcj_test_coords();">Test Coord</button>
                        <button onclick="retconjs_test_clear_black();">Clear to Black</button>
                        <button onclick="retconjs_test_clear_random();">Clear to Random</button>
                        <button onclick="retconjs_test_pixels();">Random Pixels</button>
                        <button onclick="retconjs_test_sprite();">Add Sprite</button>
                        <button onclick="retconjs_test_sprite_move_horizontal();">Horizontal Movement</button>
                        <button onclick="retconjs_test_sprite_move_vertical();">Vertical Movement</button>
                        <button onclick="retconjs_test_sprite_move_random();">Random Movement</button>
                        <button onclick="retconjs_test_clear_sprites();">Clear All Sprites</button>
                        <button onclick="retconjs_test_increase_move_speed();">Increase Move Speed</button>
                        <button onclick="retconjs_test_decrease_move_speed();">Decrease Move Speed</button>
                        <button onclick="retconjs_test_music();">Test Music</button>
                        <button onclick="retconjs_test_metronome();">Test Metronome</button>
                        <button onclick="retconjs_test_input();">Test Input</button>
                </div>
        </div>
        <canvas id="retcon" width="1" height="1" class="test-canvas">
                Sorry, your browser must support canvas to play this game.
        </canvas>
        <div style="text-align:center;font-weight:bold;">
                Sprite Count: <span id="sprite-count"></span>
        </div>
        <div style="text-align:center;font-weight:bold;">
                Move Speed: <span id="move-speed"></span>
        </div>
</body>
<?php require_once "retconjs.php" ?>

</html>