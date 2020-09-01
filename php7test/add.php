<?php

require_once 'data.php';
require_once 'functions.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $lot = $_POST;
    $required = ['name', 'category', 'description', 'lot-rate', 'lot-step', 'lot-date'];
    $dict = ['name' => 'Наименование', 'category' => 'Категория', 'description' => 'Описание', 'image' => 'Изображение', 'lot-rate' => 'Начальная цена', 'lot-step' => 'Шаг ставки', 'lot-date' => 'Дата окончания торгов'];
    $errors = [];

    foreach ($_POST as $key => $value) {
        if (in_array($key, $required)) {
            if (!$value) {
                $errors[$dict[$key]] = 'Это поле надо заполнить';
            }
        }
    }

    if ($_POST['category'] === 'Выберите категорию') {
        $errors[$dict['category']] = 'Это поле надо заполнить';
    }

    if (isset($_FILES['lot-img']['name'])) {
        $tmp_name = $_FILES['lot-img']['tmp_name'];
        $path = $_FILES['lot-img']['name'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $file_type = finfo_file($finfo, $tmp_name);
        $png = "image/png";
        $jpeg = "image/jpeg";
        if ($file_type !== $jpeg && $file_type !== $png) {
            $errors['Изображение'] = 'Загрузите картинку в формате JPG или PNG';
        } else {
            move_uploaded_file($tmp_name, 'img/' . $path);
            $lot['url'] = $path;
        }
    } else {
        $errors['Изображение'] = 'Вы не загрузили изображение';
    }

    if (count($errors)) {
        $page_content = renderTemplate('templates/add-lot.php', ['arrayOfProduct' => $arrayOfProduct, 'lot' => $lot, 'errors' => $errors]);
    } else {
        $page_content = renderTemplate('templates/lot.php', ['arrayOfProduct' => $arrayOfProduct, 'lot' => $lot]);
    }
} else {
    $page_content = renderTemplate('templates/add-lot.php', ['arrayOfProduct' => $arrayOfProduct, 'lot' => $lot]);
}

$layout_content = renderTemplate('templates/layout.php', ['title' => 'Добавить лот', 'content' => $page_content, 'arrayOfCategories' => $arrayOfCategories]);

print($layout_content);
