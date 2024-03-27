import Styles from './Categories.module.css'
import CategoriesForm from './Categories/CategoriesForm';
import CategoriesTable from './Categories/CategoriesTable';
import { useState } from 'react'


function Categories () {
    const [rendering, setRender] = useState(false)
    return (
        <div className={Styles.container}>
            <div className={Styles.leftpage}>
                <CategoriesForm rendered={rendering} setRender={setRender}/>
            </div>
            
            <div className={Styles.rightpage}>
                <div className={Styles.catTable}>
                    <CategoriesTable rendered={rendering} setRender={setRender}/>
                </div>
            </div>
        </div>
    )
}

export default Categories