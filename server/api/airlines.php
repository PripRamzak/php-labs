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

use exception;

require_once (__DIR__.'/../database/dbmanager.php');

$dbManager = new DataBaseManager();

$requestMethod = $_SERVER['REQUEST_METHOD'];
error_log("Request Method: $requestMethod");

$table_name = 'airlines';
$method = isset($_GET['method']) ? $_GET['method'] : '';

error_log("Table Name: $table_name");
error_log("Method: $method");

$json = file_get_contents('php://input');
$data = json_decode($json, true);
error_log("Request Data: " . json_encode($data));

$chr_ru_en = "A-Za-zА-Яа-яЁё\s`~!@#$%^&*()_+-={}0-9|:;<>?,.\/\"\'\\\[\]";

function validateAirlineData($dbManager, &$data, $excludeId = null) {
    $errors = [];
    global $table_name;

    if (empty($data['name'])) {
        $errors[] = 'Название авиакомпании обязательно';
    } 
    else if (!preg_match('/^[^0-9!@#$%^&*()_+=\-{}\[\]:;"\'<>,.?\/`~]+$/u', $data['name'])) 
    {
        $errors[] = 'Название авиакомпании не может содержать цифры и спец символы';
    }
    else 
    {
        $data['name'] = preg_replace('/\s+/', ' ', $data['name']);

        $allData = $dbManager->get_all_data($table_name);
        foreach ($allData as $airline) 
        {
            if ($airline['name'] == $data['name'] && $airline['id'] != $excludeId) {
                $errors[] = 'Такая авиакомпания уже существует';
                break;
            }
        }
    }

    return empty($errors) ? ['status' => 'ok'] : ['status' => 'error', 'error' => $errors];
}

switch ($requestMethod) {
    case 'GET':
        $data = $dbManager->get_all_data($table_name);

        if (isset($data['error']) && strpos($data['error'], "Table 'aviasales.airlines' doesn't exist") !== false) {
            $dbManager->create_table_rooms();
        }

        $data = $dbManager->get_all_data($table_name);

        echo json_encode($data);
        break;

    case 'POST':
        switch ($method) {
            case 'create_table':
                $columns = isset($data['columns']) ? $data['columns'] : [];
                $result = $dbManager->create_table($table_name, $columns);
                echo json_encode(['result' => $result]);
                break;

            case 'insert':
                $dataToInsert = isset($data) ? $data : [];
                $validationResult = validateAirlineData($dbManager, $dataToInsert, $table_name);
                if ($validationResult['status'] === 'ok') {
                    try {
                        $result = $dbManager->insert_data($table_name, $dataToInsert);
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

                $validationResult = validateAirlineData($dbManager, $newData, $condition);
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
