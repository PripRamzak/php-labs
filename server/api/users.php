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

$table_name = 'users';
$method = isset($_GET['method']) ? $_GET['method'] : '';

$json = file_get_contents('php://input');
$data = json_decode($json, true);

function validateUserData($dbManager, $data, $excludeId = null)
{
    $errors = [];
    global $table_name;

    if (empty($data['username'])) {
        $errors[] = 'Имя пользователя обязательно';
    } elseif (strlen($data['username']) > 16) {
        $errors[] = 'Имя пользователя не должно превышать 16 символов';
    } elseif (!preg_match('/^[a-zA-Z0-9]+$/', $data['username'])) {
        $errors[] = 'Имя пользователя может содержать только буквы и цифры';
    } else {
        $allData = $dbManager->get_all_data($table_name);
        foreach ($allData as $user) {
            if ($user['username'] == $data['username'] && $user['id'] != $excludeId) {
                $errors[] = 'Пользователь с таким именем уже существует';
            }
        }
    }

    if (empty($data['email'])) {
        $errors[] = 'Email обязательно';
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Неверный формат email';
    } else {
        $allData = $dbManager->get_all_data($table_name);
        foreach ($allData as $user) {
            if ($user['email'] == $data['email'] && $user['id'] != $excludeId) {
                $errors[] = 'Пользователь с таким email уже существует';
            }
        }
    }

    if (empty($data['password'])) {
        $errors[] = 'Пароль обязателен';
    }

    return empty($errors) ? ['status' => 'ok'] : ['status' => 'error', 'error' => $errors];
}

switch ($requestMethod) {
    case 'GET':
        $data = $dbManager->get_all_data($table_name);
        echo json_encode($data);
        break;

    case 'POST':
        switch ($method) {
            case 'create_table':
                echo json_encode(['result' => 'Table checked/created']);
                break;

            case 'login':
                $username = isset($data['username']) ? $data['username'] : null;
                $password = isset($data['password']) ? $data['password'] : null;
                if ($username === null || $password === null) {
                    echo json_encode(['error' => 'Заполните все поля']);
                    exit;
                }
                $result = $dbManager->get_with_condition($table_name, 'username', $username);

                if (isset($result['error'])) {
                    echo json_encode($result);
                } else if ($result['password'] != md5($password)) {
                    echo json_encode(['error' => 'Неверный пароль']);
                    exit;
                }

                unset($result['password']);
                unset($result['email']);
                echo json_encode($result);
                break;


            case 'register':
                $dataToInsert = isset($data) ? $data : [];
                $validationResult = validateUserData($dbManager, $dataToInsert);
                if (isset($validationResult['status']) && $validationResult['status'] === 'ok') {
                    try {
                        $dataToInsert['password'] = md5($dataToInsert['password']);
                        $result = $dbManager->insert_data($table_name, $dataToInsert);
                        echo json_encode($result);
                    } catch (Exception $e) {
                        if (strpos($e->getMessage(), '1062 Duplicate entry') !== false) {
                            echo json_encode(['error' => 'Пользователь с таким username или email уже существует']);
                        } else {
                            echo json_encode(['error' => [$e->getMessage()]]);
                        }
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
