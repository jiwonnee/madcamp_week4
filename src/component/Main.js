import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from "./swissPages/PlayerInfo";
import { useRound } from './swissPages/RoundInfo';
import './Main.css';

// 토글 버튼 컴포넌트
const ToggleButton = ({ label, value, onClick }) => {
  return (
    <button className={`toggle-button`} onClick={onClick}>
      {label} <span className="count">{value}</span>
    </button> 
  );
};

// 전체 버튼 그룹을 관리할 부모 컴포넌트
const ToggleButtonGroup = () => {
  const [buttons, setButtons] = useState({
    player: false,
    round: false,
    tournament: false,
    notice: false
  });
  const { players } = usePlayer();
  const { rounds } = useRound();

  const navigate = useNavigate();

  return (
    <div className="toggle-button-group">
      <ToggleButton
        label="플레이어"
        value={players.length}
        onClick={() => navigate('/player')}
      />
      <ToggleButton
        label="라운드"
        value={rounds.length}
        onClick={() => navigate('/round')}
      />
      <ToggleButton
        label="토너먼트"
        value={buttons.tournament}
        onClick={() => navigate('/tournament')}
      />
      <ToggleButton
        label="공지사항"
        value={buttons.notice}
        onClick={() => navigate('/notice')}
      />
    </div>
  );
};

export default ToggleButtonGroup;
