import './App.css';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Router } from "react-router-dom";
import LoginPage from './component/LoginPage';
import SignupPage from './component/SignupPage';
import Main from './component/Main.js';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path='/main' element={<Main user={user} />} />
        </Routes>
      </div>
  );
}

export default App;