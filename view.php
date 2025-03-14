<!DOCTYPE html>
<html lang="en-US">

<head>
        <link rel="stylesheet" href="main.css">
        <meta charset="utf-8" />
        <title>retcon.js - view</title>
</head>

<body>
    <div style="text-align:center;margin:40px">
        <?php
        $required_keys = ['id', 'type'];
        foreach($required_keys as $key) {
            if(!isset($_GET[$key])) {
                echo("ERROR: Required GET variable '$key'");
                exit(1);
            }
        }

        $id = $_GET['id'];
        $type = $_GET['type'];

        $is_text = isset($_GET['text']);

        $valid_types = ['layer', 'palette', 'sprite', 'tile', 'tilemap'];
        if(!in_array($type, $valid_types)) {
            echo("ERROR: '$type' is not a valid type.<br />Valid types are: " . implode(', ', $valid_types));
            exit(1);
        }

        echo("Viewing $type #$id");
        if($is_text) echo(" as text");
        ?>
    </div>
</body>
<?php require_once "retconjs.php" ?>

</html>
