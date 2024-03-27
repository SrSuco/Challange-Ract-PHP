<?php

header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, SERVER, DELETEELEMENT, AMOUNTALTER');
header("Access-Control-Allow-Origin: *");

include '../functions/productsFunc.php';

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
            $productName = htmlspecialchars($_POST['ProductName']);
            $amount = $_POST['Amount'];
            $unitPrice = $_POST['UnitPrice'];
            $categoryName = htmlspecialchars($_POST['categorySelect']);
            return insert($myPDO, $productName, $amount, $unitPrice, $categoryName);
            break;
        case 'DELETEELEMENT':
            $code = $_GET['code'];
            return deleteElement($myPDO,$code);
            break;
    }
};
requestMethodManager()

?>