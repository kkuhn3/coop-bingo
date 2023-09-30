<?php
$str = preg_replace('/[^A-Za-z0-9\-]/', '', $_POST['id']);
unlink(($str).".json");
?>