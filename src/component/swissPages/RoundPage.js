import React from "react";
import { Link } from 'react-router-dom';
import { useRound } from "./RoundInfo";
import "./MainStyle.css"

const RoundPage = () => {
    const { rounds, addRound } = useRound();
    return (
        <div>
            <div>
                {rounds.length > 0 ? (
                    rounds.map(round => (
                        <Link to={`/round/${round.num}`}><div className="RoundDisplay">{round.num} 라운드</div></Link>
                    ))
                ) : (
                    <div className="NoneAlert">아직 진행된 라운드가 없습니다!</div>
                )}
            </div>
            <span className="RoundAdd">
                <div className="RoundAddBtn" onClick={() => {addRound() === -1? alert("더 이상 라운드를 만들 수 없습니다."):console.log("good")}}>🏆새 라운드 시작하기</div>
            </span>
        </div>
        
    )
}

export default RoundPage;