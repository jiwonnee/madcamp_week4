import React from "react";
import { usePlayer } from "./PlayerInfo";
import { Link, useNavigate, useParams } from 'react-router-dom';
import './MainStyle.css';

const PlayerInfoPage = () => {
    let { id } = useParams();
    const { players, setPlayerState } = usePlayer();
    const mainPlayer = players.find(player => player.id === parseInt(id, 10));

    const handleChange = () => {
        setPlayerState(mainPlayer.id, !mainPlayer.state);
    }

    return (
        <div className="playerInfo">
            <div className='navbar'>
                <Link className='navbarInfo' to={'/player'}>&lt;</Link>
                <span className="navbarInfo">{mainPlayer?.name}</span>
            </div>
            <table className="infoTable">
                <thead className="tableHeader">
                    <tr>
                        <th colspan="2">기본정보</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>이름</td>
                        <td className="infos">{mainPlayer.name}</td>
                    </tr>
                    <tr>
                        <td>상태</td>
                        <td className="infos">{mainPlayer.state? "참가중":"기권"}</td>
                    </tr>
                    <tr className="tableHeader">
                        <td colspan="2">성적</td>
                    </tr>
                    <tr>
                        <td>순위</td>
                        <td className="infos">{mainPlayer.rank}위</td>
                    </tr>
                    <tr>
                        <td>승패</td>
                        <td className="infos">{mainPlayer.win}승 {mainPlayer.loss}패</td>
                    </tr>
                    <tr>
                        <td>점수</td>
                        <td className="infos">{mainPlayer.score}점</td>
                    </tr>
                    <tr>
                        <td>부크홀츠</td>
                        <td className="infos">{mainPlayer.buchholz} bhz</td>
                    </tr>
                    <tr>
                        <td>최대연승</td>
                        <td className="infos">{mainPlayer.maxWinStreak}연승</td>
                    </tr>
                </tbody>
            </table>
            <button type="button" onClick={handleChange}>{mainPlayer.state? "기권":"재참가"}</button>
        </div>
    );
}

export default PlayerInfoPage;