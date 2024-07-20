import React, { useState } from 'react';
import './css/LoginPage.css'; // 스타일을 위한 CSS 파일

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data.user); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h1>🏆All-Rounder Login</h1>
        <div class="id-field">
          <label>All-Rounder ID</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div class="password-field">
          <label>All-Rounder 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div class="login-addons">
          <div class="remember-me">
            <input type="checkbox" id="remember" name="remember" />
            <label for="remember">Remember me</label>
          </div>
          <div class="spacer"></div>
          <div class="forgot-pwd">
            <label><div class="alter-page">비밀번호를 잊으셨나요?</div></label>
          </div>
        </div>
        
        <button type="submit" class="btn draw-border">Login</button>

        <div>
            <label class="sign-in-prompt">계정이 없으신가요?&nbsp;<div class="alter-page">새 계정 만들기</div></label>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
