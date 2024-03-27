const categoryRegister = document.querySelector('#categoryRegister');

//Prevent page refresh

categoryRegister.addEventListener("submit", async event => {
  event.preventDefault();
});

//links to Routers

const url = "http://localhost/routers/categories.php";

//Delete Category

const deleteCategory = async(code) => {
  const data = await fetch(`${url}?code=${code}`, {
    method: 'DELETEELEMENT'
  });
  const dbData = await data.json();
  return dbData;
};

//Validate Fields

const isValidFields = () => {
  if (document.getElementById("categoryTax").value > 0) {
    return document.getElementById("categoryRegister").reportValidity();
  } else {
    alert('The value of "tax" must be higher than 0');
  }
};

//Clear filled fields on submiting

const clearFields = () => {
  const fields = document.querySelectorAll(".formField");
  fields.forEach((field) => (field.value = ""));
};

//Fetch Info In Categories DB
const fetchDB = async() => {
  const data = await fetch(url, {
    method: 'GET',
  });
  const dbData = await data.json();
  return dbData;
};

//Fetch Form Data

const fetchForm = async() => {
  const form = document.getElementById('categoryRegister');
  const formData = new FormData(form);
  const data = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: formData
  });
  const response = await data.json();
};


//SaveCategory

const saveCategory = async() => {
  if (isValidFields()) {
    await fetchForm();
    await updateTable();
    clearFields();
  }
};


//Create Table in HTML

const createRow = (dbData) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
		<td id="codTable">${dbData.code}</td>        
		<td id="catTable">${dbData.name}</td>
		<td id="taxTable">${dbData.tax}%</td>
		<td id="delTable"><button type="button" id="delCatButton-${dbData.code}"> X </button></td>
	`;
  document.querySelector("#tableCategory>tbody").appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll("#tableCategory>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = async() => {
  const dbData = await fetchDB();
  clearTable();
  dbData.forEach(createRow);
};

const delButton = async(event) => {
  if (event.target.type == "button") {
    const [action, code] = event.target.id.split("-");
    if (action == "delCatButton") {
      await deleteCategory(code);
      updateTable();
    }
  }
};

updateTable();

//Interactions

document.getElementById("addCat").addEventListener("click", saveCategory);

document
  .querySelector("#tableCategory>tbody")
  .addEventListener("click", delButton);