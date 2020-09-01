<?php

function renderTemplate($path, array $data = [])
{
    if (!file_exists($path)) {
        return '';
    } else {
        ob_start();
        extract($data);
        include_once $path;
        $output = ob_get_clean();
        return $output;
    }
}


function formatPrice($price)
{
    if (!is_numeric($price)) {
        return '';
    } else {
        $formatedPrice = ceil($price);
        $formatedPrice = ($formatedPrice > 1000) ? $formatedPrice = number_format($formatedPrice) : $formatedPrice;
        return $formatedPrice;
    }
}

function getExpirationTime()
{
    $ts = time();
    $ts_midnight = strtotime('tomorrow');
    $secstomidnight = $ts_midnight - $ts;
    $hours = floor($secstomidnight / 3600);
    $minutes = floor(($secstomidnight % 3600) / 60);
    $time_limit[] = $hours;
    $time_limit[] = $minutes;
    return $time_limit;
}
