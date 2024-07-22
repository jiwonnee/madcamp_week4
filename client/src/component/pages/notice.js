import React from 'react';
import Nav from '../common/Nav';
import '../../assets/styles/css/Notice.css';

const Notice = ({ user }) => {
  return (
    <div>
      <Nav user={user} />
      <div className="notice-container">
        <h1 className="title">공지사항</h1>
        <p>여기에 공지사항 내용을 표시합니다.</p>
      </div>
    </div>
  );
};

export default Notice;
