import Styles from '../Products.module.css'
import { useState, useEffect } from 'react';


function ProductsForm ({rendered, setRender}) {

    const url = "http://localhost/routers/products.php";
    const urlCategories = "http://localhost/routers/categories.php";

    const [categories, setCategories] = useState ([])
    
    useEffect(() => {
        const fetchCategory = async() => {
            const data = await fetch(urlCategories, {
              method: 'GET',
            })
            .then((resp) => resp.json())
            .then((dbData) => {
                setCategories(dbData)
            })
            .catch((err) => console.log(err))
        }
        fetchCategory()
    }, [])

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


    const clearFields = () => {
        const fields = document.querySelectorAll(".formField")
        fields.forEach((field) => (field.value = ""))
    }
      
    const fetchForm = async() => {
        const form = document.getElementById('registerProd')
        const formData = new FormData(form)
        const data = await fetch(url, {
          method: 'POST',
          mode: 'cors',
          body: formData
        })
        const response = await data.json()
    }

    const saveProduct = async(e) => {
            e.preventDefault()
        if (isValidFields()) {
            await fetchForm()
            setRender(!rendered)
            clearFields()
        }
    }

    return (
        <form id="registerProd" onSubmit={saveProduct}>
            <div className={Styles.inputBasic}>
                <input
                    type="text"
                    id="ProductName"
                    name="ProductName"
                    className="formField"
                    placeholder="Product Name:"
                    required
                />
            </div>
            <br />
            <div className={Styles.amtePrc}>
                <input
                    type="number"
                    id="Amount"
                    name="Amount"
                    className="formField"
                    placeholder="Amount:"
                    required
                />
                <input
                    type="number"
                    id="UnitPrice"
                    name="UnitPrice"
                    className="formField"
                    placeholder="Unit Price:"
                    required
                />
            </div>
            <br />
            <div className={Styles.SelectCategory}>
                <select
                    id="categorySelect"
                    name="categorySelect"
                    className="formField"
                    defaultValue=""
                    required
                >
                    <option value="" disabled hidden>
                        Catergories:
                    </option>
                    {categories.map((option) => (
                        <option value={option.name} key={option.code}>{option.name}</option>
                    ))}
                </select>
            </div>
            <br />
            <div className={Styles.AddButtonProd}>
                <button type="submit" id="addProd">Add Product</button>
            </div>
        </form>
    )
    
}

export default ProductsForm