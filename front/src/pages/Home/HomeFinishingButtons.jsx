import { BsBagXFill, BsBagCheckFill } from "react-icons/bs";
import { useState, useEffect } from 'react';
import Styles from '../Home.module.css'

function ProductsTable ({rendered, setRender}) {
    const url = "http://localhost/routers/home.php";
    const urlHome2 = "http://localhost/routers/homeAlternative.php";
    const urlProducts = "http://localhost/routers/products.php";
    const urlProductsUpdate = "http://localhost/routers/productsAlter.php";
  
    const locale = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      });
      const [cart, setCart] = useState([])
      const [order, setOrder] = useState ([])
      const [products, setProducts] = useState ([])
      const [toggle, setToggle] = useState (false)
    
    useEffect(() => {
        const fetchOrder = async() => {
            const data = await fetch(url, {
              method: 'GET',
            })
            .then((resp) => resp.json())
            .then((dbData) => {
                setOrder(dbData)
            })
            .catch((err) => console.log(err))
        }
        fetchOrder()
    }, [])

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
    }, [rendered])

    const savePurchase = async (purchase) => {
        const data = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(purchase)
        });
        const response = await data.json();
        return response;
    };

    const updateAmounts = async(newAmount) => {
        const data = await fetch(urlProductsUpdate, {
          method: 'POST',
          body: JSON.stringify(newAmount)
        });
        const dbData = await data.json();
        return dbData;
    };

    const saveOrder = async() => {
        const dbBuy = cart;
        const dbProducts = products;
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
        } else {
            alert("No products in Cart");
        };
    };

    const deleteBuy = async() => {
        const data = await fetch(urlHome2, {
          method: 'DELETEELEMENT'
        });
        setRender(!rendered)
        setToggle(false)
        const dbData = await data.json();
        return dbData;
    };

    const delButton = async() => {
        await deleteBuy();
        document.getElementById("totalTax").value = "";
        document.getElementById("totalPrice").value = "";
    };

    const totalTaxes = (toggle) => {
        if(!toggle){
            const dbCart = cart;
            let totalTax = 0;
            let totalPrice = 0;
            for (let i = 0; i < dbCart.length; i++) {
                totalTax = totalTax + Number(dbCart[i].tax);
                totalPrice = totalPrice + Number(dbCart[i].price);
            }
            if(totalTax > 0 && totalPrice > 0){
                document.getElementById("totalTax").value = locale.format(totalTax);
                document.getElementById("totalPrice").value = locale.format (totalPrice);
            }
        }
    };
    
    return (
        <>
            {totalTaxes()}
            <div className={Styles.TotalwTaxes}>
                <p><b>Tax:</b> <input type="text" id="totalTax" disabled /></p>
                <p><b>Total:</b> <input type="text" id="totalPrice" disabled /></p>
            </div>
            <div className={Styles.endbuttons}>
                <div className={Styles.buttoncancel}>
                    <button type="button" id="cancelButton" onClick={() => delButton()}><BsBagXFill /> Cancel</button>
                </div>
                <div className={Styles.buttonfinish}>
                    <button type="button" id="finishButton" onClick={() => saveOrder()}><BsBagCheckFill /> Finish </button>
                </div>
            </div>
        </>
    )
}

export default ProductsTable