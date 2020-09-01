<?php

require_once 'data.php';
require_once 'functions.php';

$lot = null;
$id = $_GET['id'];

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    foreach ($arrayOfProduct as $key => $item) {
        if ($key == $id) {
            $lot = $item;
            break;
        }
    }
}

if (!$lot) {
    http_response_code(404);
}

$visitedLotsName = "visitedlots";
$visitedArr = [];
$expire = strtotime("+1 days");
$path = "/";
$visitedArrEncoded = "";

if (isset($_COOKIE[$visitedLotsName])) {
    $jsonArr = $_COOKIE[$visitedLotsName];
    $visitedArr = json_decode($jsonArr);
    if (!in_array($id, $visitedArr)) {
        $visitedArr[] = $id;
    } else {
        // $indexInArr = array_search($id, $visitedArr);
        // unset($visitedArr[$indexInArr]); // аналог slice нужен
        // $visitedArr[] = $id;
    }
} else {
    $visitedArr[] = $id;
}
//в отд функцию, подключить в хистори

$visitedArrEncoded = json_encode($visitedArr);
setcookie($visitedLotsName, $visitedArrEncoded, $expire, $path);

$page_content = renderTemplate('templates/lot.php', ['lot' => $lot]);
$layout_content = renderTemplate('templates/layout.php', ['title' => $lot['name'], 'content' => $page_content, 'arrayOfCategories' => $arrayOfCategories]);

print($layout_content);
