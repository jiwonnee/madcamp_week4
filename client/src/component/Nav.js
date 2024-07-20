import Logo from "./Khartes_Logo_Mini.png";
import { Link } from 'react-router-dom';
import React from 'react';
import './Nav.css';

const Nav = () => {
    return (
        <div className='navbar'>
            <Link className='icon' to={'/'}><img className="logoImg" src={Logo} alt='Logo'></img></Link>
            <Link className='navbarMenu' to={'/'}>All-Rounder</Link>
        </div>
    )
}

export default Nav;
