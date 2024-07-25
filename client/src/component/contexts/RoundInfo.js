import React, { createContext, useContext, useState, useEffect } from "react";
import { usePlayer } from "./PlayerInfo";

const RoundContext = createContext();

export const RoundProvider = ({ children, tournament_id }) => {
  const { players, addOppFromRound, updateResFromMatch } = usePlayer();

  const [rounds, setRounds] = useState([]);
  const [tournamentInfo, setTournamentInfo] = useState(null);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/tournament/${tournament_id}/rounds`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch rounds");
        }

        const data = await response.json();
        setRounds(data.rounds);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchRounds();
  }, [tournament_id]);
  useEffect(() => {
    const fetchTournamentInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/tournament/${tournament_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tournament info");
        }

        const data = await response.json();
        setTournamentInfo(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchTournamentInfo();
  }, [tournament_id]);

  const updateRoundsInDatabase = async (rounds) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/tournament/${tournament_id}/updateRounds`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rounds }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update rounds");
      }

      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.error(err.message);
      // 에러 처리 (예: 알림 표시 등)
    }
  };

  const setRoundsAndUpdateDatabase = (updatedRounds) => {
    setRounds(updatedRounds);
    updateRoundsInDatabase(updatedRounds);
  };

  const fetchWins = async (playerIds) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/tournament/fetchWins",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerIds }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wins");
      }

      const data = await response.json();
      return data.wins; // 각 플레이어의 승수를 반환
    } catch (err) {
      console.error(err.message);
      return {};
    }
  };

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  const groupAndShufflePlayers = async (players) => {
    const playerIds = players.map((player) => player.user_id);
    const wins = await fetchWins(playerIds); // 서버에서 승수 데이터를 가져옴

    const groupedByWins = players.reduce((acc, player) => {
      const winCount = wins[player.user_id] || 0;
      (acc[winCount] = acc[winCount] || []).push(player);
      return acc;
    }, {});

    const sortedKeys = Object.keys(groupedByWins).sort((a, b) => b - a);

    const shuffledPlayers = sortedKeys.reduce((acc, key) => {
      const shuffledGroup = shuffleArray(groupedByWins[key]);
      return [...acc, ...shuffledGroup];
    }, []);

    return shuffledPlayers;
  };

  async function makeNewRound(round_id) {
    let newRound = [];
    let matchedIds = new Set();
    let cnt = 0;
    let dropNum = 0;

    let tmpPlayers = await groupAndShufflePlayers(players);

    console.log("After Group and Shuffle");
    console.log(tmpPlayers);

    while (1) {
      for (let i = 0; i < players.length; i++) {
        if (matchedIds.has(tmpPlayers[i].user_id)) continue;
        if (tmpPlayers[i].state === false) {
          dropNum = dropNum + 1;
          continue;
        }
        for (let j = i + 1; j < players.length; j++) {
          if (matchedIds.has(tmpPlayers[j].user_id)) continue;
          if (tmpPlayers[j].state === false) continue;

          if (!tmpPlayers[i].opponentId.includes(tmpPlayers[j].user_id)) {
            newRound.push({
              tournament_id: tournament_id,
              player1Id: tmpPlayers[i].user_id,
              player2Id: tmpPlayers[j].user_id,
              player1Res: 1,
              player2Res: 1,
              matchNum: newRound.length + 1,
              round_id: round_id
            });
            matchedIds.add(tmpPlayers[i].user_id);
            matchedIds.add(tmpPlayers[j].user_id);
            break;
          }
        }
      }
      if (
        matchedIds.size + ((tmpPlayers.length - dropNum) % 2) ===
        tmpPlayers.length - dropNum
      )
        break;
      else {
        newRound = [];
        matchedIds = new Set();
        tmpPlayers = await groupAndShufflePlayers(players);
        dropNum = 0;
        cnt++;
      }

      if (cnt > 500) return -1;
    }
    for (let i = 0; i < players.length; i++) {
      if (!matchedIds.has(tmpPlayers[i].user_id) && tmpPlayers[i].state) {
        newRound.push({
          tournament_id: tournament_id,
          player1Id: tmpPlayers[i].user_id,
          player2Id: -1,
          player1Res: 2,
          player2Res: 0,
          matchNum: newRound.length + 1,
          round_id: round_id
        });
      }
    }
    console.log(newRound);
    return newRound;
  }

  const addRound = async () => {
    const newRound = await makeNewRound(tournamentInfo.round_cnt + 1);
    if (newRound === -1) return -1;
    addOppFromRound(newRound);
    console.log([...rounds, ...newRound]);
    setRoundsAndUpdateDatabase([...rounds, ...newRound]);
  
    try {
      const response = await fetch(`http://localhost:3001/api/tournament/${tournamentInfo.id}/increaseRound`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update round count');
      }
  
      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.error(err.message);
    }
  };

  const updateMatch = (num, matchNum, newRes) => { //round_id, matchNum, match
    updateResFromMatch(num, newRes);
    const updatedRounds = rounds.map((round, roundIndex) => {
      if (round.round_id !== num || round.matchNum !== matchNum) return round;
      return newRes;
    });
    console.log(updatedRounds);
    setRoundsAndUpdateDatabase(updatedRounds);
  };

  const value = {
    rounds,
    addRound,
    updateMatch,
  };

  return (
    <RoundContext.Provider value={value}>{children}</RoundContext.Provider>
  );
};

export const useRound = () => useContext(RoundContext);
