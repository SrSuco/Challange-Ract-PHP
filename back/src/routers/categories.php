<?php

header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, SERVER, DELETEELEMENT');
header("Access-Control-Allow-Origin: *");

include '../functions/categoriesFunc.php';

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
            $categoryName = htmlspecialchars($_POST['categoryName']);
            $categoryTax = $_POST['categoryTax'];
            return insert($myPDO, $categoryName, $categoryTax);
            break;
        case 'DELETEELEMENT':
            $code = $_GET['code'];
            return deleteElement($myPDO, $code);
            break;
    }
};
requestMethodManager()

?>