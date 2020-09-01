<?php

require_once 'data.php';
require_once 'functions.php';

$visitedLotsName = "visitedlots";
if (isset($_COOKIE[$visitedLotsName])) {
    $jsonArr = $_COOKIE[$visitedLotsName];
    $visitedArr = json_decode($jsonArr);
};

$page_content = renderTemplate('templates/history.php', ['arrayOfProduct' => $arrayOfProduct, 'visitedArr' => $visitedArr]);
$layout_content = renderTemplate('templates/layout.php', ['title' => 'История просмотров', 'content' => $page_content, 'arrayOfCategories' => $arrayOfCategories]);

print($layout_content);
