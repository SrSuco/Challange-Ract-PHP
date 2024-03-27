import Styles from './Home.module.css'
import HomeForm from './Home/HomeForm'
import HomeTable from './Home/HomeTable'
import HomeFinishingButtons from './Home/HomeFinishingButtons'
import { useState } from 'react'

function Home () {
    const [rendering, setRender] = useState(false)
    return (
        <div className={Styles.container}>
            <div className={Styles.leftpage}>
                <HomeForm rendered={rendering} setRender={setRender}/>
            </div>
            <div className={Styles.rightpage}>
                <div className={Styles.finishInfo}>
                    <HomeFinishingButtons rendered={rendering} setRender={setRender}/>
                </div>
                <div className={Styles.TableCart}>
                    <HomeTable rendered={rendering}/>
                </div>
            </div>
        </div>

    )
}

export default Home