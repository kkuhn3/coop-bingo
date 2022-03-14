<?php
echo json_encode(preg_grep('~\.(json)$~', scandir(".")));
?>