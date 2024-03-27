import { BsFillTrash3Fill } from "react-icons/bs"
import { CiBarcode } from "react-icons/ci"
import {BsClipboard2Fill} from "react-icons/bs"
import { HiReceiptTax } from "react-icons/hi"
import { useEffect, useState } from 'react'

function CategoriesTable ({rendered, setRender}) {
    const url = "http://localhost/routers/categories.php"

    const [categories, setCategories] = useState ([])

    useEffect(() => {
        const fetchDB = async() => {
            const data = await fetch(url, {
              method: 'GET',
            })
            .then((resp) => resp.json())
            .then((dbData) => {
                setCategories(dbData)
            })
            .catch((err) => console.log(err))
        }
        fetchDB()
}, [rendered])

    const deleteCategory = async(code) => {
        const data = await fetch(`${url}?code=${Number(code)}`, {
          method: 'DELETEELEMENT'
        });
        const dbData = await data.json();
        setRender(!rendered)
        return dbData;
    };

    return (
        <table id="tableCategory">
            <thead>
                <tr>
                    <th id="codTable"><CiBarcode /> Code</th>
                    <th id="catTable"><BsClipboard2Fill /> Category</th>
                    <th id="taxTable"><HiReceiptTax /> Tax</th>
                    <th id="delTable">Action</th>
                </tr>
            </thead>

            <tbody>
            {categories.map((row) => (      
                <tr key={row.code}>
                   <td id="codTable">{row.code}</td>
                   <td id="catTable">{row.name}</td>
                   <td id="taxTable">{row.tax + "%"}</td>
                   <td id="delTable" onClick={() => deleteCategory(row.code)}><button><BsFillTrash3Fill /></button></td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default CategoriesTable