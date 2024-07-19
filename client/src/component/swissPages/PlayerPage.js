import React from "react";
import { usePlayer } from "./PlayerInfo";
import { Link } from 'react-router-dom';
import "./MainStyle.css";

const PlayerComponent = ({id, name}) => {
    return (
        <div>
            <div className="playerComponent" key={id}>
                <span className="playerID">{id}</span>
                &nbsp;
                <span className="playerName">{name}</span>
                <br />
            </div>
        </div>
    );
}

const PlayerPage = () => {
    const { players } = usePlayer();
    return (
        <div className="PlayerOverall">
            <div className="PlayerList">
                {players.length > 0 ? (
                    players.map(player => (
                        <Link to={`/player/info/${player.id}`}><PlayerComponent key={player.id} id={player.rank} name={player.name} /></Link>
                    ))
                ) : (
                    <div className="NoneAlert">아직 플레이어가 없습니다!</div>
                )}
            </div>
            <Link className="ToAddPage" to={'/player/addplayer'}>
                <div className="PlayerAdd">
                    🙋새 플레이어 추가하기
                </div>
            </Link>
        </div>
    );
}

export default PlayerPage;