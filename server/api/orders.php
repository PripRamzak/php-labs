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

require_once(__DIR__ . '/../database/dbmanager.php');

$dbManager = new DataBaseManager();

$requestMethod = $_SERVER['REQUEST_METHOD'];

$table_name = 'orders';
$method = isset($_GET['method']) ? $_GET['method'] : '';
$user_id = isset($_GET['userId']) ? $_GET['userId'] : 0;

$json = file_get_contents('php://input');
$data = json_decode($json, true);

function validateOrderData($data)
{
    $errors = [];

    if (empty($data['surname'])) {
        $errors[] = 'Фамилия обязательна';
    } elseif (!preg_match('/^[а-яА-ЯёЁ]+$/u', $data['surname'])) {
        $errors[] = 'Фамилия должна содержать только русские буквы';
    } elseif (empty($data['firstname'])) {
        $errors[] = 'Имя обязательно';
    } elseif (!preg_match('/^[а-яА-ЯёЁ]+$/u', $data['firstname'])) {
        $errors[] = 'Имя должно содержать только русские буквы';
    } elseif (!preg_match('/^[а-яА-ЯёЁ]+$/u', $data['middlename']) && !empty($data['middlename'])) {
        $errors[] = 'Отчество должно содержать только русские буквы';
    }

    return empty($errors) ? ['status' => 'ok'] : ['status' => 'error', 'error' => $errors];
}

switch ($requestMethod) {
    case 'GET':
        if ($user_id > 0) {
            $data = $dbManager->get_with_condition($table_name, 'user_id', $user_id, false);
            echo json_encode($data);
        } else {
            $data = $dbManager->get_all_data($table_name);
            echo json_encode($data);
        }
        break;

    case 'POST':
        switch ($method) {
            case 'create_table':
                createTableIfNotExists($dbManager, $table_name);
                echo json_encode(['result' => 'Table checked/created']);
                break;

            case 'insert':
                $dataToInsert = isset($data) ? $data : [];
                $validationResult = validateOrderData($dbManager, $dataToInsert, $table_name);
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

                try {
                    $result = $dbManager->update_data($table_name, $newData, $condition);
                    echo json_encode(['result' => $result]);
                } catch (Exception $e) {
                    echo json_encode(['error' => [$e->getMessage()]]);
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
