<?php

$bets = [
    ['name' => 'Иван', 'price' => 11500, 'ts' => strtotime('-' . rand(1, 50) . ' minute')],
    ['name' => 'Константин', 'price' => 11000, 'ts' => strtotime('-' . rand(1, 18) . ' hour')],
    ['name' => 'Евгений', 'price' => 10500, 'ts' => strtotime('-' . rand(25, 50) . ' hour')],
    ['name' => 'Семён', 'price' => 10000, 'ts' => strtotime('last week')]
];

date_default_timezone_set('Europe/Moscow');
$is_auth = (bool) rand(0, 1);
$user_name = 'Вован';
$user_avatar = 'img/user.jpg';

$arrayOfCategories = ['Доски и лыжи', 'Крепления', 'Ботинки', 'Одежда', 'Инструменты', 'Разное'];
$arrayOfProduct = [
    ['name' => '2014 Snowboard', 'category' => 'Доски и лыжи', 'price' => '10999', 'url' => 'lot-1.jpg', 'description' => 'Lorem ipsum'],
    ['name' => '2016 Snowboard', 'category' => 'Доски и лыжи', 'price' => '159999', 'url' => 'lot-2.jpg', 'description' => 'Lorem ipsum'],
    ['name' => 'Крепление 2015', 'category' => 'Крепления', 'price' => '8000', 'url' => 'lot-3.jpg', 'description' => 'Lorem ipsum'],
    ['name' => 'Ботинки для сноуборда 2015', 'category' => 'Ботинки', 'price' => '10999', 'url' => 'lot-4.jpg', 'description' => 'Lorem ipsum'],
    ['name' => 'Куртка для сноуборда 2015', 'category' => 'Одежда', 'price' => '7500', 'url' => 'lot-5.jpg', 'description' => 'Lorem ipsum'],
    ['name' => 'Маска для сноуборда 2015', 'category' => 'Разное', 'price' => '5400', 'url' => 'lot-6.jpg', 'description' => 'Lorem ipsum'],
];
