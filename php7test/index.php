<?php

require_once 'data.php';
require_once 'functions.php';

$page_content = renderTemplate('templates/main.php', ['arrayOfProduct' => $arrayOfProduct]);
$layout_content = renderTemplate('templates/layout.php', ['title' => 'Главная', 'content' => $page_content, 'arrayOfCategories' => $arrayOfCategories]);

print($layout_content);