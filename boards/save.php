<?php
$str = str_replace("\\", "", $_POST['id'], $count);
$str = str_replace(".", "", $str, $count);
$str = str_replace("/", "", $str, $count);
file_put_contents(($str).".json",$_POST['state']);
?>