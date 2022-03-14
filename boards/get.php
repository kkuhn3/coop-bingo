<?php
$str = str_replace("\\", "", $_POST['id'], $count);
$str = str_replace(".", "", $str, $count);
$str = str_replace("/", "", $str, $count);
echo file_get_contents(($str).".json");
?>