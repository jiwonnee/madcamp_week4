import React, { useRef } from "react";
import { Link, useParams } from 'react-router-dom';
import { useRound } from "./RoundInfo";
import { useReactToPrint } from 'react-to-print';

const RoundInfoPage = () => {
    let { numS } = useParams();
    const { rounds, updateMatch } = useRound();
    const num = parseInt(numS, 10);

    const componentRef = useRef();

    class PrintTable extends React.Component {
        render() {
            if(rounds[num - 1].round.length === 1){
                return (
                    <table className="PrintTable">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>플레이어 1</th>
                                <th>플레이어 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rounds[num - 1].round.map((round, index) => {
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{round.player1.name}</td>
                                        <td>{round.player2.name}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )
            }

            return (
                <table className="PrintTable">
                    <thead>
                        <tr>
                        <th>번호</th>
                            <th>플레이어 1</th>
                            <th>플레이어 2</th>
                            <th>번호</th>
                            <th>플레이어 1</th>
                            <th>플레이어 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rounds[num - 1].round.map((round, index ,arr) => {
                            if (index % 2 !== 0) return null;

                            const nextRound = arr[index + 1]; // 다음 요소
                        
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{round.player1.name}</td>
                                <td>{round.player2.name}</td>
                        
                                {/* 다음 요소가 있을 경우에만 표시 */}
                                {nextRound ? <td>{index + 2}</td> : <td />}
                                {nextRound ? <td>{nextRound.player1.name}</td> : <td />}
                                {nextRound ? <td>{nextRound.player2.name}</td> : <td />}
                              </tr>
                            )
                        })}
                    </tbody>
                </table>
            )
        }
    }

    const handleOnClick = (matchNum, side) => {
        let newRes = {};
        if(rounds[num - 1].round[matchNum - 1].player2.id === -1) return;
        const updatedRounds = rounds.map((round, roundIndex) => {
            if (roundIndex === num - 1) {
                // 특정 라운드에서만 작업을 수행합니다.
                const updatedMatches = round.round.map(match => {
                    if (side === 1 && match.matchNum === matchNum) {
                        // player1Res를 업데이트합니다.
                        return newRes = { ...match, player1Res: (match.player1Res + 1) % 3 };
                    } else if (side === 2 && match.matchNum === matchNum){
                        return newRes = { ...match, player2Res: (match.player2Res + 1) % 3 };
                    } else {
                        return match;
                    }
                });
                return { ...round, round: updatedMatches };
            } else {
                return round;
            }
        });
        updateMatch(num, matchNum, newRes);
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    return (
        <div>
            <div className='navbar'>
                <Link className='navbarInfo' to={'/player'}>&lt;</Link>
                <span className="navbarInfo">{num} 라운드</span>
            </div>
            <div>
                {rounds[num - 1].round.map((round, index) => {
                    return (
                        <div className="matchResult">
                            <span key={index}>
                                <Link className="playerLink" to={`/player/info/${round.player1.id}`}>{round.player1.name}</Link>&nbsp;
                                <button className={`resBtn ${round.player1Res === 2 ? 'win' : round.player1Res === 1 ? 'draw' : 'lose'}`} onClick={() => handleOnClick(round.matchNum, 1)}>{round.player1Res === 2? "승":(round.player1Res === 1? "무":"패")}</button>
                                <div className="vs">&nbsp;#{index + 1}&nbsp;</div>
                                <button className={`resBtn ${round.player2Res === 2 ? 'win' : round.player2Res === 1 ? 'draw' : 'lose'}`} onClick={() => handleOnClick(round.matchNum, 2)}>{round.player2Res === 2? "승":(round.player2Res === 1? "무":"패")}</button>
                                &nbsp;{
                                    round.player2.id !== -1 ? (
                                        <Link className="playerLink" to={`/player/info/${round.player2.id}`}>{round.player2.name}</Link>
                                    ) : (
                                        <span>{round.player2.name}</span>
                                    )
                                }
                            </span>
                            <br />
                        </div>
                    )
                })}
                <div className="PrintComponent">
                    <div onClick={handlePrint} className="PrintBtn">🖨️ 대진표 출력하기</div>
                    <div ref={componentRef} className="PrintComponent">
                        <PrintTable />
                    </div>
                    
                </div>
            </div>
            
        </div>
    );
}

export default RoundInfoPage;
