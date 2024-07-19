import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const StartPage = () => {
  return (
    <div>
      <Nav />
      <Main />
    </div>
  );
}

const PlayerRender = () => {
  return (
    <div>
      <Nav />
      <Main />
      <PlayerPage />
    </div>
  );
}

const AddPlayerRender = () => {
  return (
    <div>
      <AddPlayerPage />
    </div>
  );
}

const PlayerInfoRender = ({id}) => {
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
      <Main />
      <NoticePage />
    </div>
  );
}

const TournamentRender = () => {
  return (
    <div>
      <Nav />
      <Main />
      <TournamentPage />
    </div>
  );
}

const RoundRender = () => {
  return (
    <div>
      <Nav />
      <Main />
      <RoundPage />
    </div>
  );
}

const RoundInfoRender = ({numS}) => {
  return (
    <div>
      <RoundInfoPage />
    </div>
  );
}

function App() {
  return (
    <PlayerProvider>
      <RoundProvider>
        <BrowserRouter>
          <div className='App'>
            <Routes>
              <Route path='/' element={<StartPage />}></Route>
              <Route path='/player' element={<PlayerRender />}></Route>
              <Route path='/player/addplayer' element={<AddPlayerRender />}></Route>
              <Route path='/player/info/:id' element={<PlayerInfoRender />}></Route>
              <Route path='/round' element={<RoundRender />}></Route>
              <Route path='/round/:numS' element={<RoundInfoRender />}></Route>
              <Route path='/tournament' element={<TournamentRender />}></Route>
              <Route path='/notice' element={<NoticeRender />}></Route>
            </Routes>
          </div>
        </BrowserRouter>
      </RoundProvider>
    </PlayerProvider>
  );
}

export default App;
