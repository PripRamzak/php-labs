<?php

namespace database;

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

use Exception;
use DateTime;

require_once(__DIR__ . '/../database/dbmanager.php');

$dbManager = new DataBaseManager();

$requestMethod = $_SERVER['REQUEST_METHOD'];

$table_name = 'tickets';
$method = isset($_GET['method']) ? $_GET['method'] : '';
$airline_id = isset($_GET['airlineId']) ? $_GET['airlineId'] : 0;
$user_id = isset($_GET['userId']) ? $_GET['userId'] : 0;

$json = file_get_contents('php://input');
$data = json_decode($json, true);

date_default_timezone_set('Etc/GMT+3');

function validateTicketData(&$data)
{
    $errors = [];
    global $method;

    if (empty($data['departure_city_id']) || empty($data['arrival_city_id'])) {
        $errors[] = 'Название города обязательно ';
    } else if (empty($data['departure_time']) || empty($data['arrival_time'])) {
        $errors[] = 'Время обязательно';
    } else if (empty($data['airline_id']) && strcasecmp($method, 'update') != 0) {
        $errors[] = 'Название аэропорта обязательно';
    } else if (empty($data['price'])) {
        $errors[] = 'Цена обязательна';
    } else {
        $departure_time = new DateTime($data['departure_time'], new \DateTimeZone('UTC'));
        $arrival_time = new DateTime($data['arrival_time']);
        $now = new DateTime('now');
        if ($departure_time < $now || $arrival_time < $now) {
            $errors[] = 'Невалидная дата';
        } else {
            $departure_time->setTimezone(new \DateTimeZone('Europe/Moscow'));
            $arrival_time->setTimezone(new \DateTimeZone('Europe/Moscow'));
            $data['departure_time'] = $departure_time->format("Y-m-d H:i:s");
            $data['arrival_time'] = $arrival_time->format("Y-m-d H:i:s");
        }
    }

    return empty($errors) ? ['status' => 'ok'] : ['error' => $errors];
}

switch ($requestMethod) {
    case 'GET':
        if ($airline_id > 0) {
            $data = $dbManager->get_with_condition($table_name, 'airline_id', $airline_id, false);
            echo json_encode($data);
        } elseif ($user_id > 0) {
            $data = $dbManager->call_procedure('priority_tickets', ['user_id' => $user_id]);
            echo json_encode($data);
        } else {
            $data = $dbManager->get_all_data($table_name);
            echo json_encode($data);
        }
        break;

    case 'POST':
        switch ($method) {
            case 'insert':
                $dataToInsert = isset($data) ? $data : [];
                $validationResult = validateTicketData($dataToInsert);
                if ($validationResult['status'] === 'ok') {
                    try {
                        $result = $dbManager->call_procedure('create_ticket', $dataToInsert);
                        echo json_encode(['result' => $result]);
                    } catch (Exception $e) {
                        echo json_encode(['error' => $e->getMessage()]);
                    }
                } else {
                    echo json_encode($validationResult);
                }
                break;

            case 'delete':
                $id = isset($data['id']) ? $data['id'] : null;
                if ($id === null) {
                    echo json_encode(['error' => 'ID is required for delete operation.']);
                    exit;
                }
                $result = $dbManager->delete_data($table_name, $id);
                echo json_encode(['result' => $result]);
                break;

            case 'update':
                $condition = isset($data['id']) ? $data['id'] : null;
                $newData = isset($data['new_data']) ? $data['new_data'] : null;

                $validationResult = validateTicketData($newData);
                if ($validationResult['status'] === 'ok') {
                    try {
                        $result = $dbManager->update_data($table_name, $newData, $condition);
                        echo json_encode(['result' => $result]);
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
