import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';
import Logo from './Khartes_Logo_Mini.png'; // 로고 이미지 임포트

const Nav = () => {
  return (
    <div className="nav-container">
      <div className="nav-left">
        <Link className='icon' to={'/'}><img className="logoImg" src={Logo} alt='Logo' /></Link>
        <Link className='app-title' to={'/'}>All-Rounder</Link>
      </div>
      <div className="nav-right">
        <div className="user-info">
          <div className="user-circle">
            <span className="user-name">jwon</span>
          </div>
          <div className="dropdown">
            <button className="dropdown-btn">▼</button>
            <div className="dropdown-content">
              <Link to="/userinfo">기본 정보</Link>
              <Link to="/joininfo">참여 정보</Link>
              <Link to="/notice">공지사항</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
