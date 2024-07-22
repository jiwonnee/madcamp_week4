import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from './component/LoginPage.js';
import SignupPage from './component/SignupPage.js';
import Main from './component/Main.js';
import UserInfo from './component/pages/userinfo.js';
import JoinEvent from './component/pages/JoinEvent.js';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3001/api/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
            console.log(data.user);
            navigate('/main', { state: { user: data.user } });
          }
        })
        .catch(error => {
          console.error('Error verifying token:', error);
        });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/main"
          element={user ? <Main user={user} onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/userinfo"
          element={user ? <UserInfo user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/join_event"
          element={user ? <JoinEvent user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
