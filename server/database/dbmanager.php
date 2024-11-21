<?php

namespace DataBase;

require_once(__DIR__ . '/dbconnection.php');

use PDO;
use PDOException;

class DataBaseManager
{
    private $pdo;

    public function __construct()
    {
        $db = new DataBaseConnection();
        $this->pdo = $db->get_pdo();
    }

    public function get_all_data($table_name)
    {
        try {
            $query = "SELECT * FROM {$table_name}";
            $statement = $this->pdo->prepare($query);
            $statement->execute();
            $data = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $data;
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function get_with_condition($table_name, $column, $value, $one_record = true)
    {
        try {
            $query = "SELECT * FROM {$table_name} WHERE {$column} = :val";
            $statement = $this->pdo->prepare($query);
            $statement->bindValue(":val", $value);
            $statement->execute();
            if ($one_record)
                $data = $statement->fetch(PDO::FETCH_ASSOC);
            else
                $data = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $data;
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function insert_data($table_name, $data)
    {
        $columns = array_keys($data);
        $columnNames = implode(', ', $columns);

        $placeholders = array_map(function ($column) {
            return ':' . $column;
        }, $columns);
        $placeholderNames = implode(', ', $placeholders);

        $sql = "INSERT INTO {$table_name} ({$columnNames}) VALUES ({$placeholderNames})";
        $statement = $this->pdo->prepare($sql);

        foreach ($data as $column => $value) {
            $statement->bindValue(':' . $column, $value);
        }

        $statement->execute();
        return $this->pdo->lastInsertId();
    }

    public function get_pdo()
    {
        return $this->pdo;
    }

    public function create_table($table_name, $columns)
    {
        $columnDefinitions = [];

        foreach ($columns as $column) {
            foreach ($column as $name => $type) {
                $columnDefinitions[] = "{$name} {$type}";
            }
        }

        $columnDefinitionsString = implode(', ', $columnDefinitions);
        $sql = "CREATE TABLE IF NOT EXISTS {$table_name} ({$columnDefinitionsString})";

        $statement = $this->pdo->prepare($sql);
        $statement->execute();

        return 'ok';
    }

    public function delete_data($table_name, $id)
    {
        $query = "DELETE FROM {$table_name} WHERE id = :id";
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':id', $id);
        $statement->execute();

        return $statement->rowCount();
    }

    public function update_data($table_name, $data, $condition)
    {
        $columns = array_keys($data);
        $setStatements = [];

        foreach ($columns as $column) {
            $setStatements[] = "{$column} = :{$column}";
        }
        $setClause = implode(', ', $setStatements);

        $sql = "UPDATE {$table_name} SET {$setClause} WHERE id = {$condition}";
        $statement = $this->pdo->prepare($sql);

        foreach ($data as $column => $value) {
            $statement->bindValue(':' . $column, $value);
        }

        $statement->execute();
        return $statement->rowCount();
    }

    public function call_procedure($procedure_name, $data)
    {
        $columns = array_keys($data);
        $setParameters = [];

        foreach ($columns as $parameter) {
            $setParameters[] = ":" . $parameter;
        }

        $setParameters = implode(', ', $setParameters);

        $sql = "CALL $procedure_name($setParameters)";

        $stmt = $this->pdo->prepare($sql);

        foreach ($data as $parameter => $value) {
            $stmt->bindValue(':' . $parameter, $value);
        }

        $stmt->execute();
    }

    public function tableExists($tableName)
    {
        $query = "SHOW TABLES LIKE ?";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([$tableName]);
        return $stmt->rowCount() > 0;
    }
}
