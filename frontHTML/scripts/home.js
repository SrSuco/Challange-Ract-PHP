const registerProd = document.getElementById("selectionForm");

//links to Routers

const url = "http://localhost/routers/home.php";
const urlAlternative = "http://localhost/routers/homeAlternative.php";
const urlCategories = "http://localhost/routers/categories.php";
const urlProducts = "http://localhost/routers/products.php";
const urlProductsUpdate = "http://localhost/routers/productsAlter.php";



//Prevent page refresh

registerProd.addEventListener("submit", function (event) {
	event.preventDefault();
});

//Fetch Info In Categories DB

const fetchDBCategory = async () => {
	const dataCategory = await fetch(urlCategories, {
		method: 'GET',
	});
	const dbDataCategory = await dataCategory.json();
	return dbDataCategory;
};

//Fetch Info In Products DB 

const fetchDBProducts = async () => {
	const data = await fetch(urlProducts, {
		method: 'GET',
	});
	const dbData = await data.json();
	return dbData;
};

//Fetch Info In Cart DB 

const fetchDBTemporary = async () => {
	const data = await fetch(urlAlternative, {
		method: 'GET',
	});
	const dbData = await data.json();
	return dbData;
};

//Fetch Previous Info In Purchase DB

const fetchDB = async () => {
	const data = await fetch(url, {
		method: 'GET',
	});
	const dbData = await data.json();
	return dbData;
};

//Creates Options for selection

const createOption = (dbProducts) => {
	const newOption = document.createElement("option");
	newOption.innerHTML = `
	${dbProducts.name}      
	`;
	document.querySelector("#productSelect").appendChild(newOption);
};

const updateOptions = async () => {
	const dbProducts = await fetchDBProducts();
	dbProducts.forEach(createOption);
};

updateOptions();

//Fetch Form Data

const fetchForm = async (productCode, selectedAmt, totalTaxes, totalwTaxes) => {
	const itemPurchase = {
		productCode,
		selectedAmt,
		totalTaxes,
		totalwTaxes
	}
	const data = await fetch(urlAlternative, {
		method: 'POST',
		body: JSON.stringify(itemPurchase)
	});
	const response = await data.json();
	return response;
};

//Deletes Buy
const deleteBuy = async() => {
	const data = await fetch(urlAlternative, {
	  method: 'DELETEELEMENT'
	});
	const dbData = await data.json();
	return dbData;
  };

//Changes Values in Taxes and Prices
const itemSelect = async () => {
	const productsDB = await fetchDBProducts();
	const categoryDB = await fetchDBCategory();
	const selectProd = document.getElementById("productSelect").value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	for (let i = 0; i < productsDB.length; i++) {

		if (productsDB[i].name === selectProd) {
			const priceProd = productsDB[i].price;
			for (let j = 0; j < categoryDB.length; j++) {
				if (categoryDB[j].code === productsDB[i].category_code) {
					const itemTax = categoryDB[j].tax;
					const locale = new Intl.NumberFormat("en-US", {
						currency: "USD",
						style: "currency",
					});
					document.getElementById(
						"TaxValue"
					).value = `Tax: ${itemTax}%`;
					document.getElementById("UnitPrice").value = locale.format(priceProd);
				}
			}
		}
	}
};

//Validate Fields on the Form

const isValidFields = async () => {
	const selectedAmt = document.getElementById("Amount").value;
	const selectedProd = document.getElementById("productSelect").value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
	let totalInCart = 0;
	let totalProducts;
	let totalAvailable;
	if (selectedAmt > 0) {
		const dbProducts = await fetchDBProducts();
		const dbCart = await fetchDBTemporary();
		for (let i = 0; i < dbProducts.length; i++) {
			if (selectedProd === dbProducts[i].name) {
		
				totalProducts = dbProducts[i].amount;
				if (dbCart) {
					for (let j = 0; j < dbCart.length; j++) {
						if (dbCart[j].product_code === dbProducts[i].code) {
					
							totalInCart = dbCart[j].amount + totalInCart;
						};
					};
					totalAvailable = totalProducts - totalInCart
				};
				if (totalAvailable >= selectedAmt && totalAvailable!=0) {
					return document.getElementById("selectionForm").reportValidity();
				} else {
					window.alert(
						`Quantity disponible for purchase ${totalAvailable}`
					);
				};
			};
		};
	} else {
		alert("The value of 'Amount' must be higher than 0!");
	}
};

//Clear filled fields on submiting Form

const clearFields = () => {
	const fields = document.querySelectorAll(".formField");
	fields.forEach((field) => (field.value = ""));
};

//Saves in the Cart

const saveBuy = async () => {
	const dbProducts = await fetchDBProducts();
	const dbCategory = await fetchDBCategory();
	let unitPrice;
	let productCode;
	let itemTax;
	const selectedProd = document.getElementById("productSelect").value;
	const selectedAmt = document.getElementById("Amount").value;
	for (let i = 0; i < dbProducts.length; i++) {
		if (selectedProd.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;") === dbProducts[i].name) {
			unitPrice = dbProducts[i].price;
			productCode = dbProducts[i].code;
			for (let j = 0; j < dbCategory.length; j++) {
				if (dbCategory[j].code === dbProducts[i].category_code) {
					itemTax = dbCategory[j].tax;
				}
			}
		}
	}
	if (await isValidFields()) {
		let totalPrice = unitPrice * selectedAmt;
		let tax = itemTax / 100;
		let totalTaxes = totalPrice * tax;
		let totalwTaxes = totalPrice + totalTaxes;
		await fetchForm(productCode, selectedAmt, totalTaxes, totalwTaxes);
		updateTable();
		clearFields();
	}
};

//Create table in HTML

const createRow = async (dbBuy) => {
	const dbProducts = await fetchDBProducts();
	let productName;
	let productPrice;
	for (let i = 0; i < dbProducts.length; i++) {
		if (dbBuy.product_code === dbProducts[i].code) {
			productName = dbProducts[i].name;
			productPrice = dbProducts[i].price;
		}
	}
	const newRow = document.createElement("tr");
	const locale = new Intl.NumberFormat("en-US", {
		currency: "USD",
		style: "currency",
	});
	newRow.innerHTML = ` 
		<td id="prod">${productName}</td>
		<td id="prc">${locale.format(productPrice)}</td>
		<td id="qnt">${dbBuy.amount}</td>
		<td id="tot">${locale.format(dbBuy.price)}</td>
	`;
	document.querySelector("#tableBuy>tbody").appendChild(newRow);
		const dbCart = await fetchDBTemporary();
		let totalTax = 0;
		let totalPrice = 0;
		for (let i = 0; i < dbCart.length; i++) {
			totalTax = totalTax + Number(dbCart[i].tax);
			totalPrice = totalPrice + Number(dbCart[i].price);
		}
		document.getElementById("totalTax").value = locale.format(totalTax);
		document.getElementById("totalPrice").value = locale.format(totalPrice);
};

const clearTable = () => {
	const rows = document.querySelectorAll("#tableBuy>tbody tr");
	rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = async () => {
	const dbBuy = await fetchDBTemporary();
	clearTable();
	dbBuy.forEach(createRow);
};

const delButton = async(event) => {
	if (event.target.type == "button") {
	  const [action] = event.target.id.split("-");
	  if (action == "cancelButton") {
		await deleteBuy();
		document.getElementById("totalTax").value = "";
		document.getElementById("totalPrice").value = "";
		updateTable();
	  };
	};
  };

updateTable();

//Saves purchased Data
const savePurchase = async (purchase) => {
	const data = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(purchase)
	});
	const response = await data.json();
	return response;
};


//save in orders DB

const saveHistory = async() => {
	const dbBuy = await fetchDBTemporary();
	const dbProducts = await fetchDBProducts();
	let productCode;
	let productTotal;
	if (dbBuy.length > 0) {
		const purchase = {
			taxesTotal: Number(document.getElementById("totalTax").value.replace("$","").replace(/,/g,"")),
			priceTotal: Number(document.getElementById("totalPrice").value.replace("$","").replace(/,/g,""))
		};
		for(let i = 0; i < dbBuy.length; i++){
			let productsLeftInStock = 0;
			let productAmountInCart = 0;
			productCode = dbBuy[i].product_code;
			for(let j = 0; j < dbBuy.length; j++){
				if(dbBuy[j].product_code === productCode){
					productAmountInCart = dbBuy[j].amount + productAmountInCart;
				}
			}
			for(let j = 0; j < dbProducts.length; j++){
				if(productCode === dbProducts[j].code){
					productTotal = dbProducts[j].amount;
				}
			}
			productsLeftInStock = productTotal - productAmountInCart;
			const newAmount = {
				id: productCode,
				value: productsLeftInStock
			}
			await updateAmounts(newAmount);
		}
		await savePurchase(purchase);
		await deleteBuy();
		document.getElementById("totalTax").value = "";
		document.getElementById("totalPrice").value = "";
		await updateTable();
		await clearFields();
	} else {
		alert("No products in Cart");
	};
};


const updateAmounts = async(newAmount) => {
	const data = await fetch(urlProductsUpdate, {
	  method: 'POST',
	  body: JSON.stringify(newAmount)
	});
	const dbData = await data.json();
	return dbData;
};

//Interactions
document.getElementById("addProduct").addEventListener("click", saveBuy);

document.getElementById("cancelButton").addEventListener("click", delButton);

document.getElementById("finishButton").addEventListener("click", saveHistory);
