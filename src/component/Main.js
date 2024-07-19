// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { usePlayer } from "./swissPages/PlayerInfo";
// import { useRound } from './swissPages/RoundInfo';
// import './Main.css';

// // 토글 버튼 컴포넌트
// const ToggleButton = ({ label, value, onClick }) => {
//   return (
//     <button className={`toggle-button`} onClick={onClick}>
//       {label} <span className="count">{value}</span>
//     </button> 
//   );
// };

// // 전체 버튼 그룹을 관리할 부모 컴포넌트
// const ToggleButtonGroup = () => {
//   const [buttons, setButtons] = useState({
//     player: false,
//     round: false,
//     tournament: false,
//     notice: false
//   });
//   const { players } = usePlayer();
//   const { rounds } = useRound();

//   const navigate = useNavigate();

//   return (
//     <div className="toggle-button-group">
//       <ToggleButton
//         label="플레이어"
//         value={players.length}
//         onClick={() => navigate('/player')}
//       />
//       <ToggleButton
//         label="라운드"
//         value={rounds.length}
//         onClick={() => navigate('/round')}
//       />
//       <ToggleButton
//         label="토너먼트"
//         value={buttons.tournament}
//         onClick={() => navigate('/tournament')}
//       />
//       <ToggleButton
//         label="공지사항"
//         value={buttons.notice}
//         onClick={() => navigate('/notice')}
//       />
//     </div>
//   );
// };

// export default ToggleButtonGroup;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import main1 from '../images/main1.jpeg';
import main2 from '../images/main2.jpeg';
import main3 from '../images/main3.jpeg';
import main4 from '../images/main4.jpeg';

const Main = () => {
  const navigate = useNavigate();
  const [hoveredBlock, setHoveredBlock] = useState(null);

  return (
    <div className="main-container">
      <div
        className={`color-block pink ${hoveredBlock === 'pink' ? 'hovered' : ''}`}
        onMouseEnter={() => setHoveredBlock('pink')}
        onMouseLeave={() => setHoveredBlock(null)}
        onClick={() => navigate('/player')}
      >
        <span className="label">Player</span>
      </div>
      <div
        className={`color-block orange ${hoveredBlock === 'orange' ? 'hovered' : ''}`}
        onMouseEnter={() => setHoveredBlock('orange')}
        onMouseLeave={() => setHoveredBlock(null)}
        onClick={() => navigate('/round')}
      >
        <span className="label">Round</span>
      </div>
      <div
        className={`color-block green ${hoveredBlock === 'green' ? 'hovered' : ''}`}
        onMouseEnter={() => setHoveredBlock('green')}
        onMouseLeave={() => setHoveredBlock(null)}
        onClick={() => navigate('/tournament')}
      >
        <span className="label">Tournament</span>
      </div>
      <div
        className={`color-block light-green ${hoveredBlock === 'light-green' ? 'hovered' : ''}`}
        onMouseEnter={() => setHoveredBlock('light-green')}
        onMouseLeave={() => setHoveredBlock(null)}
        onClick={() => navigate('/notice')}
      >
        <span className="label">Notice</span>
      </div>
      <div className="center-text">Swiss Round</div>
    </div>
  );
};

export default Main;