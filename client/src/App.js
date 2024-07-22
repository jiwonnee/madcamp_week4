import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from './component/pages/LoginPage.js';
import SignupPage from './component/pages/SignupPage.js';
import Main from './component/pages/Main.js';
import UserInfo from './component/pages/UserInfo.js';
import JoinEvent from './component/pages/JoinEvent.js';
import CreateEvent from './component/pages/CreateEvent.js';
import main1 from './assets/images/main1.jpeg';

const initialEvents = [
  {
    id: 1,
    image: main1,
    status: '모집 중',
    date: '2024-08-01',
    location: '서울',
    participants: '10/20',
    details: '기타 정보...'
  },
  {
    id: 2,
    image: main1,
    status: '모집 중',
    date: '2024-08-05',
    location: '부산',
    participants: '5/15',
    details: '기타 정보...'
  },
  {
    id: 3,
    image: main1,
    status: '모집 중',
    date: '2024-08-10',
    location: '대구',
    participants: '8/20',
    details: '기타 정보...'
  },
  {
    id: 4,
    image: main1,
    status: '모집 중',
    date: '2024-08-15',
    location: '광주',
    participants: '12/25',
    details: '기타 정보...'
  },
  {
    id: 5,
    image: main1,
    status: '모집 중',
    date: '2024-08-20',
    location: '대전',
    participants: '7/10',
    details: '기타 정보...'
  },
  {
    id: 6,
    image: main1,
    status: '모집 중',
    date: '2024-08-25',
    location: '울산',
    participants: '15/30',
    details: '기타 정보...'
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState(initialEvents);
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

  const addEvent = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
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
          element={user ? <JoinEvent user={user} events={events} /> : <Navigate to="/" />}
        />
        <Route
          path="/create_event"
          element={user ? <CreateEvent user={user} addEvent={addEvent} /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
