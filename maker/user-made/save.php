<?php
$str = preg_replace('/[^A-Za-z0-9\-]/', '', $_POST['id']);
file_put_contents(($str).".json",$_POST['state']);
?>