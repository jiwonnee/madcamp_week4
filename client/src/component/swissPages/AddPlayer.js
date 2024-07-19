import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainStyle.css';
import { usePlayer } from "./PlayerInfo";
import { useRound } from "./RoundInfo";

const AddPlayerForm = () => {
    const { players, addPlayer } = usePlayer();
    const { rounds } = useRound();
    const [name, setName] = useState('');

    const handleChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // 기본 폼 제출 동작 방지
        let opponentId = []
        let matchResult = []
        for(let i = 0; i < rounds.length; i++){
            opponentId.push(-1);
            matchResult.push(0);
        }
        const newPlayer = {
            name: name,
            state: true,
            rank: players.length,
            win: 0,
            loss: opponentId.length,
            score: 0,
            buchholz: 0,
            maxWinStreak: 0,
            winStreakStartRound: -1,
            opponentId: opponentId,
            matchResult: matchResult,
        }
        addPlayer(newPlayer);
        setName('');
    };

    const navigate = useNavigate();

    return (
        <form className='submitForm' onSubmit={handleSubmit}>
            <label className='nameLabel' htmlFor="name">이름 </label>
                <input
                    className='nameInput'
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleChange}
                />
            <br />
            <button className='ConfirmBtn' type="submit">확인</button>
            <button className='CancelBtn' type="button" onClick={() => navigate('/player')}>취소</button>
        </form>
    );
}

const AddPlayerPage = () => {
    return (
        <div>
            <div className='navbar'>
                <Link className='navbarInfo' to={'/player'}>&lt;</Link>
                <span className="navbarInfo">플레이어 추가</span>
            </div>
            <AddPlayerForm />
        </div>
    );
}

export default AddPlayerPage;