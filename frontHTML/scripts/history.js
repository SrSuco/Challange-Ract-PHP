//Links to routers

const url = "http://localhost/routers/history.php";
const urlOrderItems = "http://localhost/routers/historyAlternative.php";
const urlProducts = "http://localhost/routers/products.php";

//fetch data from products DB
const fetchDBProducts = async () => {
	const data = await fetch(urlProducts, {
		method: 'GET',
	});
	const dbData = await data.json();
	return dbData;
};

//fetch data from orders DB

const fetchDB = async() => {
  const data = await fetch(url, {
    method: 'GET',
  });
  const dbData = await data.json();
  return dbData;
};

const openModal = async(event) => {
  document.getElementById("modal").classList.add("active");
  console.log(event.currentTarget)
  console.log(event.currentTarget.id)
  const code = event.currentTarget.id
  const data = await fetch(`${urlOrderItems}?code=${code}`, {
    method: 'GET'
  });
  const dbData = await data.json();
  console.log(dbData);
  const listItems = dbData
  console.log(listItems)
  updateTableView(listItems)
};

const closeModal = () => {
  document.getElementById("modal").classList.remove("active");
};

//Create Table in HTML

const createRowHistory = (dbHistory) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
  <td id="cod">${dbHistory.code}</td>
  <td id="tot">${dbHistory.tax}</td>
  <td id="tax">${dbHistory.total}</td>
  <td id="but"><button id="${dbHistory.code}">👁️</button></td>
	`;
  document.querySelector("#tableHistory>tbody").appendChild(newRow);
  document.getElementById(dbHistory.code).addEventListener("click", openModal);
};

const createRowList = async(listItems) => {
  const dbProducts = await fetchDBProducts();
  let productName = "";
  let productUnitPrice = 0;
  for(let i = 0; i < dbProducts.length; i++){
    if(dbProducts[i].code === listItems.product_code){
      productName = dbProducts[i].name
      productUnitPrice = dbProducts[i].price
    }
  }
  const newRow = document.createElement("tr");
  const locale = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  });
  newRow.innerHTML = `
  <td id="productBought">${productName}</td>
  <td id="unitPrice">${locale.format(productUnitPrice)}</td>
  <td id="amount">${listItems.amount}</td>
  <td id="taxes">${locale.format(listItems.tax)}</td>
  <td id="total">${locale.format(listItems.price)}</td>
	`;
  document.querySelector(".modal-Table>tbody").appendChild(newRow);
};

const updateTable = async() => {
  const dbHistory = await fetchDB();
  console.log(dbHistory);
  dbHistory.forEach(createRowHistory);
};

const updateTableView = async(listItems) => {
  clearTable()
  listItems.forEach(createRowList);
};

const clearTable = () => {
  const rows = document.querySelectorAll(".modal-Table>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

updateTable();

//Interactions

document.getElementById("modalClose").addEventListener("click", closeModal);