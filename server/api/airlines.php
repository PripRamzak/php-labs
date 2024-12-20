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

require_once(__DIR__ . '/../database/dbmanager.php');

$dbManager = new DataBaseManager();

$requestMethod = $_SERVER['REQUEST_METHOD'];

$table_name = 'airlines';
$method = isset($_GET['method']) ? $_GET['method'] : '';

$name = $_POST['name'] ?? null;
$airline_id = isset($_GET['airlineId']) ? $_GET['airlineId'] : 0;

$json = file_get_contents('php://input');
$data = json_decode($json, true);

function processImage($img_require)
{
    global $targetDir;
    if (isset($_FILES['img']) && $_FILES['img']['error'] === UPLOAD_ERR_OK) {
        $targetFile = $targetDir . "/" . basename($_FILES["img"]["name"]);
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Ограничения на размер файла
        if ($_FILES["img"]["size"] > 5000000) {
            echo json_encode(['status' => 'error', 'error' => 'Sorry, your file is too large.']);
            exit;
        }

        $allowedTypes = ['jpg', 'jpeg', 'png'];
        if (!in_array($imageFileType, $allowedTypes)) {
            echo json_encode(['status' => 'error', 'error' => 'Sorry, only JPG, JPEG, PNG files are allowed.']);
            exit;
        }

        return file_get_contents($_FILES["img"]["tmp_name"]);
    } elseif ($img_require) {
        echo json_encode(['status' => 'error', 'error' => 'Image is required.']);
        exit;
    } else {
        return false;
    }
}

function validateAirlineData($dbManager, &$data, $excludeId = null)
{
    $errors = [];
    global $table_name;

    if (empty($data['name'])) {
        $errors[] = 'Название авиакомпании обязательно';
    } else if (!preg_match('/^[^0-9!@#$%^&*()_+=\-{}\[\]:;"\'<>,.?\/`~]+$/u', $data['name'])) {
        $errors[] = 'Название авиакомпании не может содержать цифры и спец символы';
    } else {
        $data['name'] = preg_replace('/\s+/', ' ', $data['name']);

        $allData = $dbManager->get_all_data($table_name);
        foreach ($allData as $airline) {
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
        if ($airline_id > 0) {
            header('Content-Type: image/jpeg');
            $data = $dbManager->get_with_condition($table_name, 'id', $airline_id, true);
            if ($data !== false)
                echo ($data['img']);
        } else {
            $data = $dbManager->get_all_data($table_name);
            foreach ($data as &$airline) {
                unset($airline['img']);
            }
            echo json_encode($data);
        }

        break;

    case 'POST':
        switch ($method) {
            case 'create_table':
                $columns = isset($data['columns']) ? $data['columns'] : [];
                $result = $dbManager->create_table($table_name, $columns);
                echo json_encode(['result' => $result]);
                break;

            case 'insert':
                $dataToInsert['name'] = $name;
                $dataToInsert['img'] = processImage(true);
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
                $condition = $_POST['updated_id'] ?? null;
                $newData['img'] = processImage(false, $imageDate);
                $newData['name'] = $name;

                if (!isset($newData['img']))
                    unset($newData['img']);

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
