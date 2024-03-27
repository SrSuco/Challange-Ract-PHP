import { FaEye } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import Modal from '../../components/layout/Modal'
import { IoIosPricetags } from "react-icons/io";
import { CiBarcode } from "react-icons/ci";
import { HiReceiptTax } from "react-icons/hi";

function HistoryTable () {
    const url = "http://localhost/routers/history.php"
    const urlProducts = "http://localhost/routers/products.php";
    const urlOrderItems = "http://localhost/routers/historyAlternative.php";

    const locale = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
    })

    const [rowCode, setRowCode] = useState([])
    const [history, setHistory] = useState ([])
    const [modal, setModal] = useState(false)
    const [orders, setOrders] = useState([])
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

    const fetchOrders = async() => {
        const data = await fetch(`${urlOrderItems}?code=${rowCode}`, {
          method: 'GET'
        })
        .then((resp) => resp.json())
        .then((dbData) => {
            setOrders(dbData)
        })
        .catch((err) => console.log(err))
    }

    useEffect(() => {
        if(rowCode){
            fetchOrders()
        }
    }, [rowCode])

    useEffect(() => {
        const fetchDB = async() => {
            const data = await fetch(url, {
              method: 'GET',
            })
            .then((resp) => resp.json())
            .then((dbData) => {
                setHistory(dbData)
            })
            .catch((err) => console.log(err))
        }
        fetchDB()
    }, []
    )

    const toggleModal = async(row) => {
        setRowCode(row.code)
        setModal(true)
    }

return (
    <>
        <table id="tableHistory">
            <thead>
                <tr>
                    <th><CiBarcode /> Purchase Code</th>
                    <th><HiReceiptTax /> Tax</th>
                    <th><IoIosPricetags /> Total</th>
                    <th>Purchase Info</th>
                </tr>
            </thead>
            <tbody>
            {history.map((row) => (
                <tr key={row.code}>
                    <td>{row.code}</td>
                    <td>{locale.format(row.tax)}</td>
                    <td>{locale.format(row.total)}</td>
                    <td><button onClick={() => toggleModal(row)}><FaEye /></button></td>
                </tr>
            ))}
            </tbody>
        </table>
        {modal && <Modal onClose={setModal} rowCode={rowCode} orders={orders} products={products}/>}
    </>
)
}

export default HistoryTable