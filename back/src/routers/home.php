<?php

header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, SERVER, DELETEELEMENT, AMOUNTALTER');
header("Access-Control-Allow-Origin: *");

include '../functions/homeFunc.php';

function requestMethodManager(){
    $host = "pgsql_desafio";
    $db = "applicationphp";
    $user = "root";
    $pw = "root";

    $myPDO = new PDO("pgsql:host=$host;dbname=$db", $user, $pw);
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method){
        case 'GET':
            return select($myPDO);
            break;
        case 'POST':
            $dataReceived = json_decode(file_get_contents('php://input'), true);
            error_log(print_r($dataReceived, true));
            $taxesTotal = $dataReceived['taxesTotal'];
            $priceTotal = $dataReceived['priceTotal'];
            return insert($myPDO, $taxesTotal, $priceTotal);
            break;
    }
};
requestMethodManager()

?>