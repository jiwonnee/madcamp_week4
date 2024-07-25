import "./App.css";
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./component/pages/LoginPage.js";
import SignupPage from "./component/pages/SignupPage.js";
import Main from "./component/pages/Main.js";
import UserInfo from "./component/pages/UserInfo.js";
import JoinInfo from "./component/pages/JoinInfo.js";
import Notice from "./component/pages/Notice.js";
import JoinEvent from "./component/pages/JoinEvent.js";
import CreateEvent from "./component/pages/CreateEvent.js";
import Event1 from "./component/pages/Event1.js";
import Event1_Applications from "./component/pages/Event1_Applications.js";
import Event2 from "./component/pages/Event2.js";
import { PlayerProvider } from "./component/contexts/PlayerInfo.js";
import { RoundProvider } from "./component/contexts/RoundInfo.js";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3001/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
            console.log(data.user);
            navigate("/main", { state: { user: data.user } });
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
        });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/main"
            element={
              user ? (
                <Main user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/userinfo"
            element={user ? <UserInfo user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/joininfo"
            element={user ? <JoinInfo user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/notice"
            element={user ? <Notice user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/join_event"
            element={user ? <JoinEvent user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/create_event"
            element={user ? <CreateEvent user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/event/:id/detail"
            element={user ? <Event1 user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/event/:id/detail/applications"
            element={
              user ? <Event1_Applications user={user} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/event/:id/participants"
            element={user ? <Event2 user={user} /> : <Navigate to="/" />}
          />
        </Routes>
    </div>
  );
}

export default App;
