<?php

function add_js(string $filename): bool {
        if(file_exists($filename)) {
                echo "<script src='$filename'></script>";
                return true;
        }

        echo "<div>Missing required JS file: '$filename'</div>";
        return false;
}

$tsconfig_data = file_get_contents('src/tsconfig.json');
$tsconfig = json_decode($tsconfig_data, true);

// TODO read from src/tsconfig.json "files"
$file_list = $tsconfig["files"];

$success = true;
foreach($file_list as $file) {
        $success = $success && add_js(str_replace(".ts", ".js", $file));
}