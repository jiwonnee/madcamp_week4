import React from 'react';
import Nav from '../common/Nav'; 
import '../../assets/styles/css/JoinInfo.css'; 

const JoinInfo = ({ user }) => {
  return (
    <div>
      <Nav user={user} />
      <div className="join-info-container">
        <h1>참여 정보</h1>
        <p>여기에 사용자 참여 정보를 표시합니다.</p>
      </div>
    </div>
  );
};

export default JoinInfo;
