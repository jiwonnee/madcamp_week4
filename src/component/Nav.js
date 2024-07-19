import Logo from "./Khartes_Logo_Mini.png";
import { Link } from 'react-router-dom';
import React from 'react';
import './Nav.css';

const Nav = () => {
    return (
        <div className='navbar'>
            <Link className='icon' to={'/'}><img className="logoImg" src={Logo} alt='Logo'></img></Link>
            <Link className='navbarMenu' to={'/'}>스위스라운드</Link>
        </div>
    )
}

export default Nav;
