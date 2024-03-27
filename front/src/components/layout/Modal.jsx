import Styles from './Modal.module.css'
import { BsChevronExpand, BsBoxSeamFill} from "react-icons/bs";
import { FaMoneyBill } from "react-icons/fa";
import { IoIosPricetags } from "react-icons/io";
import { HiReceiptTax } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { useState, useEffect } from 'react';

const urlProducts = "http://localhost/routers/products.php";const urlOrderItems = "http://localhost/routers/historyAlternative.php";

const locale = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

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


const PurchaseModal = ({onClose, orders, products}) => {
  return (
    <div className={Styles.modal} id="modal">
      <div className={Styles.modal_content}>
        <header className={Styles.modal_header}>
          <h2>Purchase Information</h2>
          <span className={Styles.modal_close} id="modalClose" onClick={() => onClose(false)}><MdClose /></span>
        </header>
        <div className={Styles.modal_body}>
          <table className={Styles.modal_Table}>
            <thead>
              <tr>
                <th><BsBoxSeamFill /> Product</th>
                <th><FaMoneyBill /> Unit Price</th>
                <th><BsChevronExpand /> Amount</th>
                <th><HiReceiptTax /> Taxes</th>
                <th><IoIosPricetags /> Total</th>
              </tr>
            </thead>
            <tbody>
            {orders.map((row) => (
                <tr key={row.code}>
                    <td>{findProductName(products, row)}</td>
                    <td>{locale.format(findProductPrice(products, row))}</td>
                    <td>{row.amount}</td>
                    <td>{locale.format(row.tax)}</td>
                    <td>{locale.format(row.price)}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
