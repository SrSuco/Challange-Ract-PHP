import { BsCart4, BsChevronExpand} from "react-icons/bs";
import { IoIosPricetags } from "react-icons/io";
import { FaMoneyBill } from "react-icons/fa";
import { useState, useEffect } from 'react';

function ProductsTable ({rendered}) {
      const urlHome2 = "http://localhost/routers/homeAlternative.php";
      const urlProducts = "http://localhost/routers/products.php";
  
      const locale = new Intl.NumberFormat("en-US", {
          currency: "USD",
          style: "currency",
        });
    const [cart, setCart] = useState([])
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

    const findProductName = (products, row) => {
        for(let i = 0; i < products.length; i++){
            if(products[i].code === row.product_code){
                const productName = products[i].name
                return productName
            }
        }        
    }
    const findProductPrice = (products, row) => {
        for(let i = 0; i < products.length; i++){
            if(products[i].code === row.product_code){
                const productPrice = products[i].price
                return productPrice
            }
        }        
    }
    return (
        <table id="tableBuy">
            <thead>
                <tr>
                    <th id="prod"><BsCart4 /> Products</th>
                    <th id="prc"><FaMoneyBill /> Unit Price</th>
                    <th id="qnt"><BsChevronExpand /> Amount</th>
                    <th id="tot"><IoIosPricetags /> Total</th>
                </tr>
            </thead>
            <tbody>
            {cart.map((row) => (
                <tr key={row.code}>
                    <td id="prod">{findProductName(products, row)}</td>
                    <td id="prc">{locale.format(findProductPrice(products, row))}</td>
                    <td id="qnt">{row.amount}</td>
                    <td id="tot">{locale.format(row.price)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default ProductsTable