<?php
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, SERVER, DELETEELEMENT');
header("Access-Control-Allow-Origin: *");

function select($myPDO){
    $sql = "SELECT * FROM categories ORDER BY code ASC ";
    $response = $myPDO -> prepare($sql);
    $response->execute();
    $dbData = [];
    while($row = $response -> fetch(PDO::FETCH_ASSOC)){
        $dbData[] = $row;
    }
    echo json_encode($dbData);
};

function insert($myPDO, $categoryName, $categoryTax){
    $statement = $myPDO->prepare("INSERT INTO categories (name, tax) VALUES (:name, :tax)");
    $statement->bindParam(':name', $categoryName);
    $statement->bindParam(':tax', $categoryTax);
    $statement->execute();
    echo json_encode($statement);
};

function deleteElement($myPDO, $code){
    $deleteElement = $myPDO->prepare("DELETE FROM categories WHERE code=:code");
    $statement->bindParam(':code', $code);
    $deleteElement->execute();
    echo json_encode($deleteElement);
};
?>