import React, { createContext, useContext, useState } from "react";
import { usePlayer } from "./PlayerInfo";

const RoundContext = createContext();

export const RoundProvider = ({ children }) => {
    const { players, addOppFromRound, updateResFromMatch } = usePlayer();

    const [rounds, setRound] = useState([]);

    function shuffleArray(array) {
        // 배열을 랜덤하게 섞는 함수
        return array.sort(() => Math.random() - 0.5);
    }
    
    function groupAndShufflePlayers(players) {
        // 승수에 따라 player 객체를 그룹화
        const groupedByWins = players.reduce((acc, player) => {
            (acc[player.win] = acc[player.win] || []).push(player);
            return acc;
        }, {});
    
        // 그룹화된 객체의 키(승수)를 기준으로 정렬
        const sortedKeys = Object.keys(groupedByWins).sort((a, b) => b - a); // 오름차순 정렬
        // const sortedKeys = Object.keys(groupedByWins).sort((a, b) => b - a); // 내림차순 정렬
    
        // 정렬된 순서대로 각 그룹을 랜덤하게 섞고, 하나의 배열로 합침
        const shuffledPlayers = sortedKeys.reduce((acc, key) => {
            const shuffledGroup = shuffleArray(groupedByWins[key]);
            return [...acc, ...shuffledGroup];
        }, []);
    
        return shuffledPlayers;
    }
    

    function makeNewRound(){
        let newRound = [];
        let matchedIds = new Set();
        let cnt = 0;
        let dropNum = 0;

        let tmpPlayers = groupAndShufflePlayers(players);
        //console.log(tmpPlayers);
        while(1){
            for(let i = 0; i < players.length; i++){
                if(matchedIds.has(tmpPlayers[i].id)) continue;
                if(tmpPlayers[i].state === false) {dropNum = dropNum + 1; continue;}
                for(let j = i + 1; j < players.length; j++){
                    if(matchedIds.has(tmpPlayers[j].id)) continue;
                    if(tmpPlayers[j].state === false) continue;
    
                    if(!tmpPlayers[i].opponentId.includes(tmpPlayers[j].id)){
                        newRound.push({player1: tmpPlayers[i], player2: tmpPlayers[j], player1Res: 1, player2Res: 1, matchNum: newRound.length + 1});
                        matchedIds.add(tmpPlayers[i].id);
                        matchedIds.add(tmpPlayers[j].id);
                        break;
                    }
                }
            }
            if(matchedIds.size + ((tmpPlayers.length - dropNum) % 2) === tmpPlayers.length - dropNum) break;
            else {
                newRound = [];
                matchedIds = new Set();
                tmpPlayers = groupAndShufflePlayers(players);
                dropNum = 0;
                cnt++;
            }

            if(cnt > 50) return -1;
        }

        

        for(let i = 0; i < players.length; i++){
            if(!matchedIds.has(tmpPlayers[i].id) && tmpPlayers[i].state){
                const nonePlayer = {
                    id: -1,
                    name: "X",
                    state: false,
                    rank: -1,
                    win: -1,
                    loss: -1,
                    score: -1,
                    buchholz: -1,
                    maxWinStreak: -1,
                    winStreakStartRound: -1,
                    opponentId: [],
                    matchResult: [],
                }
                newRound.push({player1: tmpPlayers[i], player2: nonePlayer, player1Res: 2, player2Res: 0, matchNum: newRound.length + 1});
            }
        }
        return newRound;
    }

    const addRound = () => {
        const newRound = makeNewRound();
        if(newRound === -1) return -1;
        addOppFromRound(newRound);
        const RoundElement = {round: newRound, num: rounds.length + 1};
        //console.log(RoundElement);
        setRound([...rounds, RoundElement]);
    }

    const removeRound = (num) => {
        setRound(rounds.filter(r => r.num !== num));
    };

    const updateMatch = (num, matchNum, newRes) => {
        updateResFromMatch(num, newRes);
        setRound(rounds.map((round, roundIndex) => {
            if(roundIndex !== num - 1) return round;
            const updatedRound = round.round.map((match) =>
                match.matchNum === matchNum? newRes : match
            );
            return {round: updatedRound, num: round.num};
        }));
           
    }

    const value = {
        rounds,
        addRound,
        removeRound,
        updateMatch,
    }

    return (
        <RoundContext.Provider value={value}>
            { children }
        </RoundContext.Provider>
    )
};

export const useRound = () => useContext(RoundContext);