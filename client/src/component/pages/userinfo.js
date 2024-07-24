import React, { useEffect, useState } from 'react';
import Nav from '../common/Nav';
import '../../assets/styles/css/UserInfo.css'; 

const UserInfo = ({ user }) => {
  const [userInfo, setUserInfo] = useState({});
  const [previousGames, setPreviousGames] = useState([]);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    // 사용자 정보를 가져옴ㅌ
    fetch(`http://localhost:3001/api/userinfo/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setUserInfo(data))
      .catch(error => console.error('Error fetching user info:', error));

    // 이전 경기 정보를 가져오는 예시
    fetch(`http://localhost:3001/api/previousgames/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => setPreviousGames(data))
      .catch(error => console.error('Error fetching previous games:', error));
  }, [user.id, token]);

  return (
    <div>
      <Nav user={user} />
      <h1 className="title">사용자 정보</h1>
      <div className="user-info-container">
        <h2 className="subtitle">기본 정보</h2>
        <hr />
        <div className="user-details">
          {userInfo ? (
            <>
              <p>아이디: {user.following_userid}</p>
              <p>패스워드: {user.following_password}</p>
              <p>이메일: {user.email}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <h2 className="subtitle_2">이전 경기</h2>
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
