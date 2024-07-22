import React, { useEffect, useState } from 'react';
import Nav from '../common/Nav';
import '../../assets/styles/css/UserInfo.css'; 

const UserInfo = ({ user }) => {
  const [userInfo, setUserInfo] = useState({});
  const [previousGames, setPreviousGames] = useState([]);

  useEffect(() => {
    // 사용자 정보를 가져오는 예시
    fetch(`http://localhost:3001/api/userinfo/${user.id}`)
      .then(response => response.json())
      .then(data => setUserInfo(data))
      .catch(error => console.error('Error fetching user info:', error));

    // 이전 경기 정보를 가져오는 예시
    fetch(`http://localhost:3001/api/previousgames/${user.id}`)
      .then(response => response.json())
      .then(data => setPreviousGames(data))
      .catch(error => console.error('Error fetching previous games:', error));
  }, [user.id]);

  return (
    <div>
      <Nav user={user} />
      <div className="user-info-container">
        <h1 className="title">사용자 정보</h1>
        <hr />
        <div className="user-details">
          <p>아이디: {userInfo.username}</p>
          <p>패스워드: {userInfo.password}</p>
          <p>이메일: {userInfo.email}</p>
        </div>
        <h2 className="subtitle">이전 경기</h2>
        <hr />
        <div className="previous-games">
          {previousGames.length > 0 ? (
            previousGames.map(game => (
              <p key={game.id}>{game.details}</p>
            ))
          ) : (
            <p>이전 경기가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
