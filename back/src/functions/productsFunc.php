<?php
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, SERVER, DELETEELEMENT');
header("Access-Control-Allow-Origin: *");

function select($myPDO){
    $sql = "SELECT * FROM products ORDER BY code ASC ";
    $response = $myPDO -> prepare($sql);
    $response->execute();
    $dbData = [];
    while($row = $response -> fetch(PDO::FETCH_ASSOC)){
        $dbData[] = $row;
    }
    echo json_encode($dbData);
};

function insert($myPDO, $productName, $amount, $unitPrice, $categoryName){
    $sql = "SELECT code FROM categories WHERE name=:categoryName";
    $response = $myPDO -> prepare($sql);
    $response->bindParam(':categoryName', $categoryName);
    $response->execute();
    $row = $response->fetch(PDO::FETCH_ASSOC);
    $code = $row['code'];

    $insert = $myPDO->prepare("INSERT INTO products (name, amount, price, category_code) VALUES (:productName, :amount, :unitPrice, :code)");
    $insert->bindParam(':productName', $productName);
    $insert->bindParam(':amount', $amount);
    $insert->bindParam(':unitPrice', $unitPrice);
    $insert->bindParam(':code', $code);
    $insert->execute();
    echo json_encode($insert);
};

function update($myPDO, $code, $amount){
    $update = $myPDO->prepare("UPDATE products SET amount=:amount WHERE code=:code");
    $update->bindParam(':amount', $amount);
    $update->bindParam(':code', $code);
    $update->execute();

    $response = ['status' => 'success', 'message' => 'amount uptadated successfully'];
    echo json_encode($response);
}

function deleteElement($myPDO, $code){
    $deleteElement = $myPDO->prepare("DELETE FROM products WHERE code=:code");
    $deleteElement->bindParam(':code', $code);
    $deleteElement->execute();
    echo json_encode($deleteElement);
};
?>