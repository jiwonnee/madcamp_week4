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
        console.log("Rounds");
        console.log(data.rounds);
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
        console.log("Tournament Info");
        console.log(data);
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
    const playerIds = players.map((player) => player.id);
    const wins = await fetchWins(playerIds); // 서버에서 승수 데이터를 가져옴

    const groupedByWins = players.reduce((acc, player) => {
      const winCount = wins[player.id] || 0;
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

    console.log(tmpPlayers[0]);

    while (1) {
      for (let i = 0; i < players.length; i++) {
        if (matchedIds.has(tmpPlayers[i].id)) continue;
        if (tmpPlayers[i].state === false) {
          dropNum = dropNum + 1;
          continue;
        }
        for (let j = i + 1; j < players.length; j++) {
          if (matchedIds.has(tmpPlayers[j].id)) continue;
          if (tmpPlayers[j].state === false) continue;

          if (!tmpPlayers[i].opponentId.includes(tmpPlayers[j].id)) {
            newRound.push({
              tournament_id: tournament_id,
              player1Id: tmpPlayers[i].id,
              player2Id: tmpPlayers[j].id,
              player1Res: 1,
              player2Res: 1,
              matchNum: newRound.length + 1,
              round_id: round_id
            });
            matchedIds.add(tmpPlayers[i].id);
            matchedIds.add(tmpPlayers[j].id);
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
      if (!matchedIds.has(tmpPlayers[i].id) && tmpPlayers[i].state) {
        newRound.push({
          tournament_id: tournament_id,
          player1Id: tmpPlayers[i].id,
          player2Id: -1,
          player1Res: 2,
          player2Res: 0,
          matchNum: newRound.length + 1,
          round_id: round_id
        });
      }
    }
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

  const updateMatch = (num, matchNum, newRes) => {
    updateResFromMatch(num, newRes);
    const updatedRounds = rounds.map((round, roundIndex) => {
      if (roundIndex !== num - 1) return round;
      const updatedRound = round.round.map((match) =>
        match.matchNum === matchNum ? newRes : match
      );
      return { round: updatedRound, num: round.num };
    });
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
