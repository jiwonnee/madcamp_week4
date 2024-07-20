import React, { createContext, useContext, useState } from "react";
//import { matchRoutes } from "react-router-dom";

const PlayerContext = createContext();

export const PlayerProvider = ({children}) => {
    const [players, setPlayer] = useState([]);

    function comp(playerA, playerB) {
        if(playerA.win !== playerB.win) return playerB.win - playerA.win; //양수면 B가 위로
        if(playerA.buchholz !== playerB.buchholz) return playerB.buchholz - playerA.buchholz;
        if(playerA.opponentId.includes(-1) !== playerB.opponentId.includes(-1)){
            if(playerA.opponentId.includes(-1)) return 1;
            else return -1;
        }
        if(playerA.opponentId.includes(playerB.id)){
            if(playerA.matchResult[playerA.opponentId.indexOf(playerB.id)] === 2) return -1;
            if(playerB.matchResult[playerB.opponentId.indexOf(playerA.id)] === 2) return 1;
        }
        if(playerA.maxWinStreak !== playerB.maxWinStreak) return playerB.maxWinStreak - playerA.maxWinStreak;
        return playerB.winStreakStartRound - playerA.winStreakStartRound;
    }

    const addPlayer = (newPlayer) => {
        const sortedPlayers = [...players, {...newPlayer, id: players.length + 1}]
            .sort(comp)
            .map((player, index) => ({
                ...player,
                rank: index + 1
            }));
        setPlayer(sortedPlayers);
    };

    const rankPlayers = () => {
        const sortedPlayers = [...players]
            .sort(comp)
            .map((player, index) => ({
                ...player,
                rank: index + 1
            }));
        setPlayer(sortedPlayers);
    }

    const removePlayer = (id) => {
        setPlayer(players.filter(p => p.id !== id));
    };

    const setPlayerState = (id, changeState) => {
        setPlayer(players.map(player =>
            player.id === id? {...player, state: changeState} : player
        ));
    }

    const calculateUserInfo = (player) => {
        let w = 0;
        let l = 0;
        let sc = 0;
        //let buch = 0;
        for(let i = 0; i < player.opponentId.length; i++){
            sc = sc + player.matchResult[i];
            if(player.matchResult[i] === 2){
                w = w + 1;
            } else if(player.matchResult[i] === 0){
                l = l + 1;
            }
            /*
            players.map(p => {
                if(p.id === player.opponentId[i]) buch = buch + p.score;
            });
            */
        }
        
        let currentStart = -1; // 현재 연속 수열의 시작 인덱스
        let currentLength = 0; // 현재 연속 길이
        let maxLength = 0; // 최대 연속 길이
        let maxStart = -1; // 최대 연속 길이의 시작 인덱스

        for (let i = 0; i < player.matchResult.length; i++) {
            if (player.matchResult[i] === 2) {
                if (currentStart === -1) {
                    currentStart = i; 
                }
                currentLength += 1;
                } else {
                    if (currentLength > maxLength) {
                        maxLength = currentLength;
                        maxStart = currentStart;
                    }
                    currentStart = -1;
                    currentLength = 0;
                }
        }

        if (currentLength > maxLength) {
            maxLength = currentLength;
            maxStart = currentStart;
        }
        
        const retPlayer = {
            id: player.id,
            name: player.name,
            state: player.state,
            rank: player.rank,
            win: w,
            loss: l,
            score: sc,
            //buchholz: buch,
            buchholz: player.buchholz,
            maxWinStreak: maxLength,
            winStreakStartRound: maxStart,
            opponentId: player.opponentId,
            matchResult: player.matchResult,
        }

        return retPlayer;
    }

    const addOppFromRound = (round) => {
        const tmpPlayers1 = players.map(player => {

            let updatedOpponentId = [...player.opponentId];
            let updatedMatchResult = [...player.matchResult];

            if(player.state === false){
                updatedOpponentId = [...updatedOpponentId, -1];
                updatedMatchResult = [...updatedMatchResult, 0];
            } else {
                round.forEach(match => {
                    if (player.id === match.player1.id) {
                        updatedOpponentId = [...updatedOpponentId, match.player2.id];
                        updatedMatchResult = [...updatedMatchResult, match.player1Res];
                    } else if (player.id === match.player2.id) {
                        updatedOpponentId = [...updatedOpponentId, match.player1.id];
                        updatedMatchResult = [...updatedMatchResult, match.player2Res];
                    }
                });
            }
            const updatedPlayer = {
                ...player,
                opponentId: updatedOpponentId,
                matchResult: updatedMatchResult
            }

            return updatedPlayer;
        });

        const tmpPlayers = tmpPlayers1.map(player => calculateUserInfo(player));

        const resPlayers = tmpPlayers.map(player => {
            let buch = 0;
            for(let i = 0; i < player.opponentId.length; i++){
                tmpPlayers.map(p => {
                    if(p.id === player.opponentId[i]){
                        //console.log("For player id "+player.id+" opponent id "+p.id+" score is "+p.score);
                        buch = buch + p.score;
                    }
                });
            }
            return {...player, buchholz: buch};
        });

        const sortedPlayers = [...resPlayers]
            .sort(comp)
            .map((player, index) => ({
                ...player,
                rank: index + 1
            }));
        setPlayer(sortedPlayers);
    }

    const updateResFromMatch = (num, match) => {
        const tmpPlayers1 = players.map(player => {
            let updatedMatchResult = [...player.matchResult];

            if (player.id === match.player1.id) {
                updatedMatchResult[num - 1] = match.player1Res;
            } else if (player.id === match.player2.id) {
                updatedMatchResult[num - 1] = match.player2Res;
            }

            const updatedPlayer = {
                ...player,
                matchResult: updatedMatchResult
            }

            return updatedPlayer;
        });

        const tmpPlayers = tmpPlayers1.map(player => calculateUserInfo(player));

        const resPlayers = tmpPlayers.map(player => {
            let buch = 0;
            for(let i = 0; i < player.opponentId.length; i++){
                tmpPlayers.map(p => {
                    if(p.id === player.opponentId[i]){
                        //console.log("For player id "+player.id+" opponent id "+p.id+" score is "+p.score);
                        buch = buch + p.score;
                    }
                });
            }
            return {...player, buchholz: buch};
        });

        const sortedPlayers = [...resPlayers]
            .sort(comp)
            .map((player, index) => ({
                ...player,
                rank: index + 1
            }));
        
        setPlayer(sortedPlayers);
    }

    const value = {
        players,
        addPlayer,
        removePlayer,
        setPlayerState,
        rankPlayers,
        addOppFromRound,
        updateResFromMatch,
    };

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    )

};

export const usePlayer = () => useContext(PlayerContext);