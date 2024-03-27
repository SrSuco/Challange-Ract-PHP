import Styles from './404.module.css'
import { BsHouseDoorFill } from "react-icons/bs";
import { TbError404Off } from "react-icons/tb";

function Error404 () {
    return (
        <div className={Styles.pageNotFound}>
            <h1><TbError404Off /></h1>
            <p>Page not found!</p>
            <a href="/"><BsHouseDoorFill /></a>
        </div>
    )
}

export default Error404