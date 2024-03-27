<?php
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, SERVER, DELETEELEMENT');
header("Access-Control-Allow-Origin: *");

function select($myPDO){
    $sql = "SELECT * FROM orders ORDER BY code ASC ";
    $response = $myPDO -> query($sql);
    $dbData = [];
    while($row = $response -> fetch(PDO::FETCH_ASSOC)){
        $dbData[] = $row;
    }
    echo json_encode($dbData);
};

function selectOrders($myPDO, $code){
    $sql = "SELECT * FROM order_item WHERE order_code=:code ";
    $response = $myPDO->prepare($sql);
    $response->bindParam(':code', $code);
    $response->execute();

    $dbData = [];
    while($row = $response -> fetch(PDO::FETCH_ASSOC)){
        $dbData[] = $row;
    }
    echo json_encode($dbData);
};