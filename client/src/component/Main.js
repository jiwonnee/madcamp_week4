import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import logo from './Khartes_Logo_Mini.png';
import Nav from './Nav';

const Main = ({user}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="main-container">
        <Nav />
        <img src={logo} alt="Khartes Logo" className="logo" />
        <p className="appname">All-Rounder</p>
        <div className="button-container">
          <button className="main-button" onClick={() => navigate('/create_event')}>이벤트 개최하기</button>
          <button className="main-button" onClick={() => navigate('/join_event')}>이벤트 검색</button>
        </div>
      </div>
      <div className="about-section">
        <h2>ABOUT</h2>
        <p>All-Rounder에 대한 소개</p>
      </div>
    </div>
  );
};

export default Main;
