import React from 'react'
import Home from '../../pages/Home'
import Products from '../../pages/Products'
import Categories from '../../pages/Categories'
import History from '../../pages/History'
import Error404 from '../../pages/404'
import Styles from './NavBar.module.css'
import ThemeSelector from "../buttons/ThemeSelector"
import { BsBoxSeamFill, BsClipboard2Fill, BsBookFill, BsHouseDoorFill } from "react-icons/bs";
import { SiHomeassistantcommunitystore } from "react-icons/si";

const showUrl = () => {
  if (window.location.pathname === '/') {
	return <Home />;
  } else if (window.location.pathname === '/Products') {
	return <Products />;
  } else if (window.location.pathname === '/Categories') {
	return <Categories />;
  } else if (window.location.pathname === '/History') {
	return <History />;
  } else {
	return <Error404 />;
  }
};

function NavBar () {
	return (
		<div>
			<ThemeSelector />
			<div className={Styles.Header}>
				<h1><SiHomeassistantcommunitystore /></h1>
					  <h1>Suite Store</h1>
				<ul className={Styles.list}>
					<li className={Styles.links}><a href="/"><BsHouseDoorFill /> Home</a></li>
					<li className={Styles.links}><a href="/Products"><BsBoxSeamFill /> Products</a></li>
					<li className={Styles.links}><a href="/Categories"><BsClipboard2Fill /> Categories</a></li>
					<li className={Styles.links}><a href="/History"><BsBookFill /> History</a></li>
				</ul>
			</div>
			{showUrl()}
		</div>
	)
}

export default NavBar