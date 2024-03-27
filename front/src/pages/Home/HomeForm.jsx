import { useState, useEffect } from 'react';
import Styles from '../Home.module.css'

function HomeForm ({rendered, setRender}) {

    const url = "http://localhost/routers/home.php";
    const urlHome2 = "http://localhost/routers/homeAlternative.php";
    const urlProducts = "http://localhost/routers/products.php";
    const urlCategories = "http://localhost/routers/categories.php";

    const locale = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      });
    const [cart, setCart] = useState([])
    const [categories, setCategories] = useState ([])
    const [products, setProducts] = useState ([])
    
    useEffect(() => {
        const fetchProducts = async() => {
            const data = await fetch(urlProducts, {
              method: 'GET',
            })
            .then((resp) => resp.json())
            .then((dbData) => {
                setProducts(dbData)
            })
            .catch((err) => console.log(err))
        }
        fetchProducts()
    }, [])

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

    useEffect(() => {
        const fetchCart = async() => {
            const data = await fetch(urlHome2, {
                method: 'GET',
            })
            .then((resp) => resp.json())
            .then((dbData) => {
                setCart(dbData)
            })
            .catch((err) => console.log(err))
        }
        fetchCart()
    }, [rendered]
    )

    const fetchForm = async (productCode, selectedAmt, totalTaxes, totalwTaxes) => {
        const itemPurchase = {
            productCode,
            selectedAmt,
            totalTaxes,
            totalwTaxes
        }
        const data = await fetch(urlHome2, {
            method: 'POST',
            body: JSON.stringify(itemPurchase)
        });
        const response = await data.json();
    };

    const isValidFields = () => {
        const selectedAmt = document.getElementById("Amount").value;
        const selectedProd = document.getElementById("productSelect").value;
        let totalInCart = 0;
        let totalProducts;
        let totalAvailable;
        if (selectedAmt > 0) {
            const dbProducts = products;
            const dbCart = cart;
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


    const clearFields = () => {
        const fields = document.querySelectorAll(".formField")
        fields.forEach((field) => (field.value = ""))
    }

    const addCart = async(e) => {
        e.preventDefault()
        const dbProducts = products;
        const dbCategory = categories;
        let unitPrice;
        let productCode;
        let itemTax;
        const selectedProd = document.getElementById("productSelect").value;
        const selectedAmt = document.getElementById("Amount").value;
        for (let i = 0; i < dbProducts.length; i++) {
            if (selectedProd === dbProducts[i].name) {
                unitPrice = dbProducts[i].price;
                productCode = dbProducts[i].code;
                for (let j = 0; j < dbCategory.length; j++) {
                    if (dbCategory[j].code === dbProducts[i].category_code) {
                        itemTax = dbCategory[j].tax;
                    }
                }
            }
        }
        if (isValidFields()) {
            let totalPrice = unitPrice * selectedAmt;
            let tax = itemTax / 100;
            let totalTaxes = totalPrice * tax;
            let totalwTaxes = totalPrice + totalTaxes;
            await fetchForm(productCode, selectedAmt, totalTaxes, totalwTaxes);
            setRender(!rendered)
            clearFields();
        }
    }
    
    const itemSelect = () => {
        const productsDB = products;
        const categoryDB = categories;
        const selectProd = document.getElementById("productSelect").value;
        for (let i = 0; i < productsDB.length; i++) {
            if (productsDB[i].name === selectProd) {
                const priceProd = productsDB[i].price;
                for (let j = 0; j < categoryDB.length; j++) {
                    if (categoryDB[j].code === productsDB[i].category_code) {
                        const itemTax = categoryDB[j].tax;
                        document.getElementById(
                            "TaxValue"
                        ).value = `Tax: ${itemTax}%`;
                        document.getElementById("UnitPrice").value = locale.format(priceProd);
                    }
                }
            }
        }
    };

    return (
        <form id="selectionForm" onSubmit={addCart}>
            <div className={Styles.SelectProduct}>
                <select 
                id="productSelect" 
                className="formField" 
                defaultValue=""
                onChange={() => itemSelect()} 
                required
                >
                    <option value="" disabled hidden>Product:</option>
                    {products.map((option) => (
                        <option value={option.name} key={option.code}>{option.name}</option>
                    ))}
                </select>
            </div>
            <div className={Styles.Quantities}>
                <div className={Styles.Amount}>
                    <input 
                    type="number" 
                    id="Amount" 
                    className="formField" 
                    name="Amount" 
                    placeholder="Amount" 
                    />
                </div>
                <div className={Styles.QuantityInput}>
                    <input 
                    id="TaxValue" 
                    className="formField" 
                    name="TaxValue" 
                    placeholder="Tax" 
                    disabled 
                    />
                </div>
                <div className={Styles.QuantityInput2}>
                    <input 
                    id="UnitPrice" 
                    className="formField" 
                    name="UnitPrice" 
                    placeholder="Unit Price" 
                    disabled 
                    />
                </div>
            </div>
            <div className={Styles.AddButton}>
                <button type="submit" id="addProduct">Add Product</button>
            </div>
        </form>
    )
    
}

export default HomeForm