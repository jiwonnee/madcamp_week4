import './App.css';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from './component/Nav';
import Main from './component/Main';
import PlayerPage from './component/swissPages/PlayerPage';
import AddPlayerPage from './component/swissPages/AddPlayer';
import PlayerInfoPage from './component/swissPages/PlayerInfoPage';
import TournamentPage from './component/swissPages/TournamentPage';
import NoticePage from './component/swissPages/NoticePage';
import RoundPage from './component/swissPages/RoundPage';
import RoundInfoPage from './component/swissPages/RoundInfoPage';
import { PlayerProvider } from './component/swissPages/PlayerInfo';
import { RoundProvider } from './component/swissPages/RoundInfo';
import LoadingPage from "./component/LoadingPage";
import LoginPage from "./component/LoginPage";
import CreateEvent from './component/pages/CreateEvent';
import JoinEvent from './component/pages/JoinEvent';

const StartPage = () => {
  return (
    <div>
      <Main />
    </div>
  );
}

const PlayerRender = () => {
  return (
    <div>
      <Nav />
      <PlayerPage />
    </div>
  );
}

const AddPlayerRender = () => (
  <div>
    <AddPlayerPage />
  </div>
);

const PlayerInfoRender = ({ id }) => {
  return (
    <div>
      <PlayerInfoPage />
    </div>
  );
}

const NoticeRender = () => {
  return (
    <div>
      <Nav />
      <NoticePage />
    </div>
  );
}

const TournamentRender = () => {
  return (
    <div>
      <Nav />
      <TournamentPage />
    </div>
  );
}

const RoundRender = () => {
  return (
    <div>
      <Nav />
      <RoundPage />
    </div>
  );
}

const RoundInfoRender = ({ numS }) => {
  return (
    <div>
      <RoundInfoPage />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLoadingEnd = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingPage onAnimationEnd={handleLoadingEnd} />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <PlayerProvider>
      <RoundProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/player" element={<PlayerRender />} />
              <Route path="/player/addplayer" element={<AddPlayerRender />} />
              <Route path="/player/info/:id" element={<PlayerInfoRender />} />
              <Route path="/round" element={<RoundRender />} />
              <Route path="/round/:numS" element={<RoundInfoRender />} />
              <Route path="/tournament" element={<TournamentRender />} />
              <Route path="/notice" element={<NoticeRender />} />
              <Route path="/create_event" element={<CreateEvent />} />
              <Route path="/join_event" element={<JoinEvent />} />
            </Routes>
          </div>
        </BrowserRouter>
      </RoundProvider>
    </PlayerProvider>
  );
}

export default App;