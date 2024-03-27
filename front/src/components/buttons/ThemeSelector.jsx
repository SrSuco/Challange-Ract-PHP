import { FaSun } from "react-icons/fa"; //<FaSun />
import { BsFillMoonStarsFill } from "react-icons/bs"; //Moon: <BsFillMoonStarsFill />
import Styles from "./ThemeSelector.module.css";

const ThemeSelector = () => {

    const setDarkMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'dark')
        localStorage.setItem("selectedTheme", "dark")
    };
    const setLightMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'light')
        localStorage.setItem("selectedTheme", "light")
    };
    
    const selectedTheme = localStorage.getItem("selectedTheme");
    if(selectedTheme === "dark") {
        setDarkMode()
    }
    else{
        setLightMode()
    }

    const toggleTheme = e => {
        if(e.target.checked) setDarkMode();
        else setLightMode();
    };

    return (
        <div className={Styles.theme_selector}>
            <p><FaSun /></p>
            <input
                className={Styles.theme_selector_toggle}
                type='checkbox'
                id={Styles.theme_selector_toggle}
                onChange={toggleTheme}
                defaultChecked={selectedTheme === "dark"}
            />
            <label className={Styles.theme_label}htmlFor={Styles.theme_selector_toggle}>
            </label>
            <input
                className={Styles.theme_selector_toggle}
                type='checkbox'
                id={Styles.theme_selector_toggle}
                onChange={toggleTheme}
                defaultChecked={selectedTheme === "dark"}
            />
            <p><BsFillMoonStarsFill /></p>
        </div>
    );
}

export default ThemeSelector