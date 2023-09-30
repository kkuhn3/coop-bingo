<?php
$str = preg_replace('/[^A-Za-z0-9\-]/', '', $_POST['id']);
echo file_get_contents(($str).".json");
?>