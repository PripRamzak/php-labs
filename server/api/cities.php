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

$table_name = 'cities';
$method = isset($_GET['method']) ? $_GET['method'] : '';

$name = $_POST['name'] ?? null;

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$targetDir = "../img/cities";

function guidv4($data = null)
{
    // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
    $data = $data ?? random_bytes(16);
    assert(strlen($data) == 16);

    // Set version to 0100
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    // Set bits 6-7 to 10
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

    // Output the 36 character UUID.
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}


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

        $uuid = guidv4();
        $uploadingFile = $uuid . "." . $imageFileType;

        // Разрешенные форматы файлов
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($imageFileType, $allowedTypes)) {
            echo json_encode(['status' => 'error', 'error' => 'Sorry, only JPG, JPEG, PNG & GIF files are allowed.']);
            exit;
        }

        // Сохранение файла
        if (move_uploaded_file($_FILES["img"]["tmp_name"],  $targetDir . "/" . $uploadingFile)) {
            return $uploadingFile;
        } else {
            echo json_encode(['status' => 'error', 'error' => 'Sorry, there was an error uploading your file.']);
            exit;
        }
    } elseif ($img_require) {
        echo json_encode(['status' => 'error', 'error' => 'Image is required.']);
        exit;
    } else {
        return false;
    }
}

function validateCityData($dbManager, $data, $excludeId = null)
{
    $errors = [];
    global $table_name;

    if (empty($data['name'])) {
        $errors[] = 'Название города обязательно';
    } else if (!preg_match('/^(?!-)[а-яА-ЯёЁа-яА-ЯёЁ-]+(?<!-)$/u', $data['name'])) {
        $errors[] = 'Название города должно содержать русские буквы';
    } else {
        $allData = $dbManager->get_all_data($table_name);
        foreach ($allData as $city) {
            if ($city['name'] == $data['name'] && $city['id'] != $excludeId) {
                $errors[] = 'Такой город уже существует';
                break;
            }
        }
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
                $columns = isset($data['columns']) ? $data['columns'] : [];
                $result = $dbManager->create_table($table_name, $columns);
                echo json_encode(['result' => $result]);
                break;

            case 'insert':
                $img = processImage(true);
                $dataToInsert = ['name' => $name, 'img' => $img];
                $validationResult = validateCityData($dbManager, $dataToInsert, $table_name);
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
                $img = processImage(false);
                if ($img) {
                    $newData = ['name' => $name, 'img' => $img];
                    $old_data = $dbManager->get_with_condition($table_name, 'id', $condition);
                } else {
                    $newData = ['name' => $name];
                }

                $validationResult = validateCityData($dbManager, $newData, $condition);

                if ($validationResult['status'] === 'ok') {
                    try {
                        $result = $dbManager->update_data($table_name, $newData, $condition);
                        // if ($img)
                        //     unlink($targetDir . $old_data['img']);
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
