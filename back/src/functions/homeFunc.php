<?php
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, SERVER, DELETEELEMENT');
header("Access-Control-Allow-Origin: *");

function select($myPDO){
	$sql = "SELECT * FROM order_item ORDER BY code ASC ";
	$response = $myPDO -> prepare($sql);
	$response->execute();
	$dbData = [];
	while($row = $response -> fetch(PDO::FETCH_ASSOC)){
		$dbData[] = $row;
	}
	echo json_encode($dbData);
};

function selectTemporary($myPDO){
	$sql = "SELECT * FROM cart ORDER BY code ASC ";
	$response = $myPDO -> prepare($sql);
	$response->execute();
	$dbData = [];
	while($row = $response -> fetch(PDO::FETCH_ASSOC)){
		$dbData[] = $row;
	}
	echo json_encode($dbData);
};

function insert($myPDO, $taxesTotal, $priceTotal){
	$insert = $myPDO->prepare("INSERT INTO  orders(total, tax) VALUES (:total, :tax)");
	$insert->bindParam(':total', $priceTotal);
    $insert->bindParam(':tax', $taxesTotal);
	$insert->execute();

    $sql = "SELECT code FROM orders ORDER BY code DESC LIMIT 1";
    $response = $myPDO -> prepare($sql);
	$response->execute();
    $row = $response->fetch(PDO::FETCH_ASSOC);
    $code = $row['code'];

	$purchaseInfo = $myPDO->prepare("INSERT INTO order_item (order_code, product_code,amount,price,tax) SELECT '$code', product_code,amount,price,tax FROM cart");
	$purchaseInfo->execute();
	echo json_encode($purchaseInfo);
};

function insertCart($myPDO, $amount, $totalTaxes, $totalwTaxes, $productCode){
	$insert = $myPDO->prepare("INSERT INTO cart (product_code, amount, price, tax) VALUES (:productCode, :amount, :totalwTaxes, :totalTaxes)");
	$insert->bindParam(':productCode', $productCode);
	$insert->bindParam(':amount', $amount);
    $insert->bindParam(':totalwTaxes', $totalwTaxes);
    $insert->bindParam(':totalTaxes', $totalTaxes);
	$insert->execute();
	echo json_encode($insert);
};

function deleteElement($myPDO){
	$deleteElement = $myPDO->prepare("DELETE FROM cart");
	$deleteElement->execute();
	echo json_encode($deleteElement);
};
?>