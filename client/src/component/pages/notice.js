// Notice.js
import React from 'react';
import Nav from '../common/Nav';
import '../../assets/styles/css/Notice.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

const Notice = ({ user }) => {
  const notices = [
    "All-Rounder의 회원이 되신 것을 축하드립니다!",
    "원하는 이벤트에 참가하세요. 없으면 직접 이벤트를 추가해보세요!",
  ];

  return (
    <div>
      <Nav user={user} />
      <h1 className="title">공지사항</h1>
      <div className="notice-container">
        <div className="notice-header">
          <FontAwesomeIcon icon={faBullhorn} /> <span className="notice-content">공지사항을 확인해 주세요.</span>
        </div>
        <ul className="notice-list">
          {notices.map((notice, index) => (
            <li key={index} className="notice-item">
              <FontAwesomeIcon icon={faCheckSquare} className="notice-icon" /> {notice}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notice;
