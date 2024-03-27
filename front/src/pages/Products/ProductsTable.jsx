import { BsFillTrash3Fill } from "react-icons/bs";
import { CiBarcode } from "react-icons/ci";
import {BsClipboard2Fill, BsBoxSeamFill, BsChevronExpand} from "react-icons/bs";
import { FaMoneyBill } from "react-icons/fa";
import { useState, useEffect } from 'react';

function ProductsTable ({rendered, setRender}) {

    const url = "http://localhost/routers/products.php";
    const urlCategories = "http://localhost/routers/categories.php";

    const locale = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
      });
    const [categories, setCategories] = useState ([])
    const [products, setProducts] = useState ([])

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
        const fetchProducts = async() => {
            const data = await fetch(url, {
              method: 'GET',
            })
            .then((resp) => resp.json())
            .then((dbData) => {
                setProducts(dbData)
            })
            .catch((err) => console.log(err))
        }
        fetchProducts()
    }, [rendered])

    const deleteProducts = async(code) => {
        const data = await fetch(`${url}?code=${Number(code)}`, {
          method: 'DELETEELEMENT'
        });
        const dbData = await data.json();
        setRender(!rendered)
        return dbData;
    };

    const findCategory = (categories, row) => {
        for(let i = 0; i < categories.length; i++){
            if(categories[i].code === row.category_code){
                const categoryName = categories[i].name
                console.log(categoryName)
                return categoryName
            }
        }        
    }
    
    return (
        <table id="tableProduct">
            <thead>
                <tr>
                    <th id="codProd"><CiBarcode /> Code</th>
                    <th id="prdProd"><BsBoxSeamFill /> Product</th>
                    <th id="amtProd"><BsChevronExpand /> Amount</th>
                    <th id="untProd"><FaMoneyBill /> Unit Price</th>
                    <th id="catProd"><BsClipboard2Fill /> Category</th>
                    <th id="delProd">Action</th>
                </tr>
            </thead>
            <tbody>
            {products.map((row) => (
                <tr key={row.code}>
                    <td id="codProd">{row.code}</td>
                    <td id="prdProd">{row.name}</td>
                    <td id="amtProd">{row.amount}</td>
                    <td id="untProd">{locale.format(row.price)}</td>
                    <td id="catProd">{findCategory(categories, row)}</td>
                    <td id="delTable" onClick={() => deleteProducts(row.code)}><button><BsFillTrash3Fill /></button></td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default ProductsTable