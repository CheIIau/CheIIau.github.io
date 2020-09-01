<?php

require_once 'data.php';
require_once 'functions.php';

$name = $_POST['name'] ?? '';
$category = $_POST['category'] ?? '';
$lot_rate = $POST['lot-rate'] ?? '';
$lot_step = $POST['lot-step'] ?? '';
$lot_date = $POST['lot-date'] ?? '';

$lot = ['name' => $name, 'category' => $category, 'lot-rate' => $lot_rate, 'lot-step' => $lot_step, 'lot-date' => $lot_date];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $lot = $_POST;

    $required = ['name', 'category', 'message', 'lot-rate', 'lot-step', 'lot-date', 'lot-img'];
    $dict = ['name' => 'Наименование', 'category' => 'Категория', 'message' => 'Описание', 'lot-rate' => 'Начальная цена', 'lot-step' => 'Шаг ставки', 'lot-date' => 'Дата окончания торгов'];
    $errors = [];

    foreach ($_POST as $key => $value) {
        if (in_array($key, $required)) {
            if (!$value) {
                $errors[$dict[$key]] = 'Это поле надо заполнить';
            }
        }
    }

    // if (isset($_FILES['lot-img']['name'])) {
    //     $tmp_name = $_FILES['lot-img']['tmp_name'];
    //     $path = $_FILES['lot-img']['name'];

    //     $finfo = finfo_open(FILEINFO_MIME_TYPE);
    //     $file_type = finfo_file($finfo, $tmp_name);
    //     if ($file_type !== "image/jpg") {
    //         $errors['file'] = 'Загрузите картинку в формате JPG';
    //     } else {
    //         move_uploaded_file($tmp_name, 'uploads/' . $path);
    //         $lot['path'] = $path;
    //     }
    // } else {
    //     $errors['file'] = 'Вы не загрузили файл';
    // }
    if (count($errors)) {
        $page_content = renderTemplate('add.php', ['lot' => $lot, 'errors' => $errors, 'dict' => $dict]);
    } else {
        $page_content = renderTemplate('templates/lot.php', ['arrayOfProduct' => $arrayOfProduct, 'lot' => $lot]);
    }
} else {
    $page_content = renderTemplate('add.php', ['arrayOfProduct' => $arrayOfProduct]);
}

$page_content = renderTemplate('templates/add.php', ['arrayOfProduct' => $arrayOfProduct, 'lot_info' => $lot_info]);
$layout_content = renderTemplate('templates/layout.php', ['title' => 'Добавить лот', 'content' => $page_content, 'arrayOfCategories' => $arrayOfCategories]);

print($layout_content);
