import Styles from './Products.module.css'
import ProductsForm from './Products/ProductsForm'
import ProductsTable from './Products/ProductsTable'
import { useState } from 'react'

function Products () {
    const [rendering, setRender] = useState(false)
    return (
        <div className={Styles.container}>
            <div className={Styles.leftpage}>
                <ProductsForm rendered={rendering} setRender={setRender}/>
            </div>
            
            <div className={Styles.rightpage}>
                <div className={Styles.TableProducts}>
                    <ProductsTable rendered={rendering} setRender={setRender}/>
                </div>
            </div>
        </div>

    )
}

export default Products