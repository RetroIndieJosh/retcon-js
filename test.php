<!DOCTYPE html>
<html>
        <head>
                <link rel="stylesheet" href="main.css">
                <meta charset="utf-8"/>
                <title>retcon.js - tests</title>
        </head>
        <body>
                <canvas id="retcon" width="1" height="1">
                        Sorry, your browser must support canvas to play this game.
                </canvas>
                <button onclick="retconjs_test_clear();">Test Clear</button>
                <button onclick="retconjs_test_pixels();">Test Pixels</button>
                <button onclick="retconjs_test_sprite();">Test Sprite</button>
        </body>
        <?php require_once "retconjs.php" ?>
</html>
