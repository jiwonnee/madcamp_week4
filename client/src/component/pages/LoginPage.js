import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/css/LoginPage.css"; // Import the CSS file

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

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
        if (rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }
        onLogin(data.user);
        navigate("/main");
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
      <form onSubmit={handleSubmit} className="login-form">
        <h1>🏆All-Rounder Login</h1>
        <div className="id-field">
          <label>All-Rounder ID</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="password-field">
          <label>All-Rounder 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login-addons">
          <div className="remember-me">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember">Remember me</label>
          </div>
          <div className="spacer"></div>
          <div className="forgot-pwd">
            <label>
              <div className="alter-page">비밀번호를 잊으셨나요?</div>
            </label>
          </div>
        </div>

        <button type="submit" className="btn draw-border">
          Login
        </button>

        <div className="sign-in-prompt">
          <div>계정이 없으신가요?&nbsp;</div>
          <Link to="/signup">
            <div className="alter-page">새 계정 만들기</div>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
