const registerProd = document.querySelector("#registerProd");

//links to Routers

const url = "http://localhost/routers/products.php";
const urlCategories = "http://localhost/routers/categories.php";
const urlProductsUpdate = "http://localhost/routers/productsAlter.php";

//Prevent page refresh

registerProd.addEventListener("submit", async function (event) {
  event.preventDefault();
});

//Fetch Info In Categories DB 
const fetchDBCategory = async() => {
  const dataCategory = await fetch(urlCategories, {
    method: 'GET',
  });
  const dbDataCategory = await dataCategory.json();
  return dbDataCategory;
};

//Fetch Info In Products DB

const fetchDB = async() => {
  const data = await fetch(url, {
    method: 'GET',
  });
  const dbData = await data.json();
  return dbData;
};

//Fetch Form Data

const fetchForm = async() => {
  const form = document.getElementById('registerProd');
  const formData = new FormData(form);
  const data = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: formData
  });
  const response = await data.json();
  return response;
};

//Deletes Product

const deleteCategory = async(code) => {
  const data = await fetch(`${url}?code=${code}`, {
    method: 'DELETEELEMENT'
  });
  const dbData = await data.json();
  return dbData;
};

//Validates Fields

const isValidFields = () => {
  const index = document.getElementById("Amount").dataset.index;
  if (
    document.getElementById("Amount").value > 0 &&
    document.getElementById("UnitPrice")
  ) {
    return document.getElementById("registerProd").reportValidity();
  } else if (index == "new") {
    alert('The values of "Amount" and "UnitPrice" must be higher than 0!');
  }
};

//Clear filled fields on submiting
const clearFields = () => {
  const fields = document.querySelectorAll(".formField");
  fields.forEach((field) => (field.value = ""));
};

//Save Product

const saveProduct = async() => {
  if (isValidFields()) {
    await fetchForm();
    updateTable();
    clearFields();
  }
};

//Creates options for Selection

const createOption = (dbCategories) => {
    const newOption = document.createElement("option");
    newOption.innerHTML = `
		${dbCategories.name}      
		`;
    document.querySelector("#categorySelect").appendChild(newOption);
};

const updateOptions = async() => {
  const dbCategories = await fetchDBCategory();
  dbCategories.forEach(createOption);
};

updateOptions();

//Updates amount in products Table

const onChangeProductAmount = async(event) => {
  const { id, value } = event.currentTarget;
  const newAmount = {id, value}
  if(value > 0){
    const data = await fetch(urlProductsUpdate,{
    method: 'POST',
    body: JSON.stringify(newAmount)
    });
    const response = await data.json();
    return response;
  }
  else{
    alert("The amount value must be higher than 0!")
  }
};

//Creates Tables in HTML 

const createRow = async(dbProducts) => {
  const categoriesDB = await fetchDBCategory();
  const catCode = dbProducts.category_code;
  for(let i=0; i < categoriesDB.length; i++){
    if(catCode === categoriesDB[i].code){
      categoryName = categoriesDB[i].name;
    };
  }
  const newRow = document.createElement("tr");
  const locale = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  });
  newRow.innerHTML = `
		<td id="codProd">${dbProducts.code}</td>        
		<td id="prdProd">${dbProducts.name}</td>
		<td id="amtProd"><input type="number" id="${dbProducts.code}" value="${
    dbProducts.amount
  }"></td>
		<td id="untProd">${locale.format(dbProducts.price)}</td>
		<td id="catProd">${categoryName}</td>
		<td id="delProd"><button type="button" id="delCatButton-${dbProducts.code}"> X </button></td>
	`;
  document.querySelector("#tableProduct>tbody").appendChild(newRow);
  document
    .getElementById(dbProducts.code)
    .addEventListener("change", onChangeProductAmount);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableProduct>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = async() => {
  const dbProducts = await fetchDB();
  clearTable();
  dbProducts.forEach(createRow);
};

const delButton = async(event) => {
  if (event.target.type == "button") {
    const [action, code] = event.target.id.split("-");
    if (action == "delCatButton") {
      await deleteCategory(code);
      updateTable();
    };
  };
};

updateTable();

//Interactions
document.getElementById("addProd").addEventListener("click", saveProduct);

document
  .querySelector("#tableProduct>tbody")
  .addEventListener("click", delButton);
