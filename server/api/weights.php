<?php

header('Content-type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    exit(0);
}

use exception;

$requestMethod = $_SERVER['REQUEST_METHOD'];

$method = isset($_GET['method']) ? $_GET['method'] : '';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

function valideate_weights(&$data)
{
    $errors = [];
    if (empty($data['departure_city_weight'])) {
        $errors[] = 'Задайте вес для города отправления';
    } else if (empty($data['arrival_city_weight'])) {
        $errors[] = 'Задайте вес для города прибытия';
    } else if (empty($data['airline_weight'])) {
        $errors[] = 'Задайте вес для аэропорта';
    } else if ($data['departure_city_weight'] > 1 || $data['departure_city_weight'] < 0) {
        $errors[] = 'Значение веса должно быть больше 0 и меньше 1';
    } else if ($data['arrival_city_weight'] > 1 || $data['arrival_city_weight'] < 0) {
        $errors[] = 'Значение веса должно быть больше 0 и меньше 1';
    } else if ($data['airline_weight'] > 1 || $data['airline_weight'] < 0) {
        $errors[] = 'Значение веса должно быть больше 0 и меньше 1';
    } else if (
        $data['departure_city_weight'] == $data['arrival_city_weight'] ||
        $data['departure_city_weight'] == $data['airline_weight'] ||
        $data['arrival_city_weight'] == $data['airline_weight']
    ) {
        $errors[] = 'Значение весов не могут быть равны';
    }

    return empty($errors) ? ['status' => 'ok'] : ['status' => 'error', 'error' => $errors];
}

function create_weights($departure_city_weight = 0.4, $arrival_city_weight = 0.1, $airline_weight = 0.5)
{
    $config_data = [
        'departure_city_weight' => $departure_city_weight,
        'arrival_city_weight' => $arrival_city_weight,
        'airline_weight' => $airline_weight
    ];

    $json_data = json_encode($config_data, JSON_PRETTY_PRINT);

    $filepath = '../weights.json';

    if (file_put_contents($filepath, $json_data) !== false) {
        return ['status' => 'ok'];
    } else {
        return ['status' => 'error'];
    }
}

switch ($requestMethod) {
    case 'GET':
        if (!file_exists('../weights.json')) {
            $result = create_weights();
            if ($result['status'] !== 'ok')
                echo json_encode(['error' => 'Невозможно создать файл конфигурации']);
        }
        $weights = file_get_contents('../weights.json');
        echo $weights;
        break;

    case 'POST':
        switch ($method) {
            case 'update':
                $newData = isset($data['new_data']) ? $data['new_data'] : null;

                $validationResult = valideate_weights($newData);
                if ($validationResult['status'] === 'ok') {
                    try {
                        $result = create_weights($newData['departure_city_weight'], $newData['arrival_city_weight'], $newData['airline_weight']);
                        if ($result['status'] !== 'ok')
                            echo json_encode(['error' => 'Невозможно обновить значения весов']);
                        else
                            echo json_encode(['result' => 'OK']);
                    } catch (Exception $e) {
                        echo json_encode(['error' => $e->getMessage()]);
                    }
                } else {
                    echo json_encode($validationResult);
                }
                break;

            default:
                echo json_encode(['error' => 'Invalid method']);
                break;
        }
        break;

    default:
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
