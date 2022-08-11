<!DOCTYPE html>
<html>

<head>
        <link rel="stylesheet" href="main.css">
        <meta charset="utf-8" />
        <title>retcon.js - tests</title>
</head>

<!--TODO this should be test.json-->

<body onload="retconjs_init(5, 'game/test.json', null, true);">
        <h1 style="text-align:center;">RetConJS Testing</h1>
        <div class="menu-container">
                <div class="button-container">
                        <button onclick="rcj_unit_tests();">Run Unit Tests</button>

                        <button onclick="rcj_test_add_color();">Add Random Color</button>
                        <button onclick="rcj_test_add_palette();">Add Random Palette</button>
                        <button onclick="rcj_test_add_tile();">Add Random Tile</button>
                        <button onclick="rcj_test_add_sprite();">Add Random Sprite</button>

                        <button onclick="Video.list_colors();">List colors</button>
                        <button onclick="Video.list_palettes();">List palettes</button>
                        <button onclick="Video.list_tiles();">List tiles</button>
                        <button onclick="Video.list_backgrounds();">List backgrounds</button>
                        <button onclick="Video.list_sprites();">List sprites</button>

                        <button onclick="rcj_test_clear_default();">Clear to Color 0 (Default)</button>
                        <button onclick="rcj_test_clear_random();">Clear to Random Color</button>

                        <!-- TODO list colors-->
                        <!-- TODO list palettes-->
                        <!-- TODO list tiles-->
                        <!-- TODO list tilemaps-->
                        <!-- TODO list sprites-->
                        <!-- TODO list actors-->

                        <!--
                        <button onclick="rcj_test_pixels();">Randomize Display Pixels</button>
                        <button onclick="rcj_test_sprite_move_horizontal();">Horizontal Movement</button>
                        <button onclick="rcj_test_sprite_move_vertical();">Vertical Movement</button>
                        <button onclick="rcj_test_sprite_move_random();">Random Movement</button>
                        <button onclick="rcj_test_clear_sprites();">Clear All Sprites</button>
                        <button onclick="rcj_test_increase_move_speed();">Increase Move Speed</button>
                        <button onclick="rcj_test_decrease_move_speed();">Decrease Move Speed</button>
                        <button onclick="rcj_test_music();">Test Music</button>
                        <button onclick="rcj_test_metronome();">Test Metronome</button>
                        <button onclick="rcj_test_input();">Test Input</button>
                        -->
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