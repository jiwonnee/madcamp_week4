import React, { createContext, useContext, useState, useEffect } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children, tournament_id }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/tournament/${tournament_id}/players_moreInfo`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }

        const data = await response.json();
        setPlayers(data.players);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchPlayers();
  }, [tournament_id]);

  const updatePlayersInDatabase = async (players) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tournament/${tournament_id}/updatePlayers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ players }),
      });

      if (!response.ok) {
        throw new Error('Failed to update players');
      }

      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.error(err.message);
      // 에러 처리 (예: 알림 표시 등)
    }
  };

  const setPlayersAndUpdateDatabase = (updatedPlayers) => {
    setPlayers(updatedPlayers);
    updatePlayersInDatabase(updatedPlayers);
  };

  function comp(playerA, playerB) {
    if (playerA.win !== playerB.win) return playerB.win - playerA.win;
    if (playerA.buchholz !== playerB.buchholz)
      return playerB.buchholz - playerA.buchholz;
    if (playerA.opponentId.includes(-1) !== playerB.opponentId.includes(-1)) {
      if (playerA.opponentId.includes(-1)) return 1;
      else return -1;
    }
    if (playerA.opponentId.includes(playerB.id)) {
      if (playerA.matchResult[playerA.opponentId.indexOf(playerB.id)] === 2)
        return -1;
      if (playerB.matchResult[playerB.opponentId.indexOf(playerA.id)] === 2)
        return 1;
    }
    if (playerA.maxWinStreak !== playerB.maxWinStreak)
      return playerB.maxWinStreak - playerA.maxWinStreak;
    return playerB.winStreakStartRound - playerA.winStreakStartRound;
  }

  const addPlayer = (newPlayer) => {
    const sortedPlayers = [...players, { ...newPlayer, id: players.length + 1 }]
      .sort(comp)
      .map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
    setPlayersAndUpdateDatabase(sortedPlayers);
  };

  const rankPlayers = () => {
    const sortedPlayers = [...players].sort(comp).map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
    setPlayersAndUpdateDatabase(sortedPlayers);
  };

  const removePlayer = (id) => {
    const updatedPlayers = players.filter((p) => p.id !== id);
    const sortedPlayers = [...updatedPlayers].sort(comp).map((player, index) => ({
        ...player,
        rank: index + 1,
      }));
    setPlayersAndUpdateDatabase(sortedPlayers);
  };

  const setPlayerState = (id, changeState) => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, state: changeState } : player
    );
    setPlayersAndUpdateDatabase(updatedPlayers);
  };

  const calculateUserInfo = (player) => {
    let w = 0;
    let l = 0;
    let sc = 0;
    for (let i = 0; i < player.opponentId.length; i++) {
      sc = sc + player.matchResult[i];
      if (player.matchResult[i] === 2) {
        w = w + 1;
      } else if (player.matchResult[i] === 0) {
        l = l + 1;
      }
    }

    let currentStart = -1;
    let currentLength = 0;
    let maxLength = 0;
    let maxStart = -1;

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
      tournament_id: player.tournament_id,
      user_id: player.user_id,
      following_userid: player.following_userid,
      state: player.state,
      rank: player.rank,
      win: w,
      lose: l,
      score: sc,
      buchholz: player.buchholz,
      maxWinStreak: maxLength,
      winStreakStartRound: maxStart,
      opponentId: player.opponentId,
      matchResult: player.matchResult,
    };

    return retPlayer;
  };

  const addOppFromRound = (round) => {
    console.log(players);
    const tmpPlayers1 = players.map((player) => {
      let updatedOpponentId = [...player.opponentId];
      let updatedMatchResult = [...player.matchResult];

      if (player.state === false) {
        updatedOpponentId = [...updatedOpponentId, -1];
        updatedMatchResult = [...updatedMatchResult, 0];
      } else {
        round.forEach((match) => {
          if (player.user_id === match.player1Id) {
            updatedOpponentId = [...updatedOpponentId, match.player2Id];
            updatedMatchResult = [...updatedMatchResult, match.player1Res];
          } else if (player.user_id === match.player2Id) {
            updatedOpponentId = [...updatedOpponentId, match.player1Id];
            updatedMatchResult = [...updatedMatchResult, match.player2Res];
          }
        });
      }
      const updatedPlayer = {
        ...player,
        opponentId: updatedOpponentId,
        matchResult: updatedMatchResult,
      };

      return updatedPlayer;
    });
    console.log('ADD: Just Updated opponents, res');
    console.log(tmpPlayers1);

    const tmpPlayers = tmpPlayers1.map((player) => calculateUserInfo(player));

    console.log('ADD: Updated player info');
    console.log(tmpPlayers);

    const resPlayers = tmpPlayers.map((player) => {
      let buch = 0;
      for (let i = 0; i < player.opponentId.length; i++) {
        tmpPlayers.map((p) => {
          if (p.user_id === player.opponentId[i]) {
            buch = buch + p.score;
          }
        });
      }
      return { ...player, buchholz: buch };
    });

    console.log('ADD: Updated player buchholz');
    console.log(resPlayers);

    const sortedPlayers = [...resPlayers].sort(comp).map((player, index) => ({
      ...player,
      rank: index + 1,
    }));

    console.log('ADD: Ranked Players');
    console.log(sortedPlayers);

    setPlayersAndUpdateDatabase(sortedPlayers);
  };

  const updateResFromMatch = (num, match) => { //round_id, match
    console.log("players");
    console.log(players);
    const tmpPlayers1 = players.map((player) => {
      let updatedMatchResult = [...player.matchResult];

      if (player.user_id === match.player1Id) {
        updatedMatchResult[num - 1] = match.player1Res;
      } else if (player.user_id === match.player2Id) {
        updatedMatchResult[num - 1] = match.player2Res;
      }

      const updatedPlayer = {
        ...player,
        matchResult: updatedMatchResult,
      };

      return updatedPlayer;
    });

    console.log("Players only changed match result");
    console.log(tmpPlayers1);

    const tmpPlayers = tmpPlayers1.map((player) => calculateUserInfo(player));
    console.log("Player changed player informations");
    console.log(tmpPlayers);

    const resPlayers = tmpPlayers.map((player) => {
      let buch = 0;
      for (let i = 0; i < player.opponentId.length; i++) {
        tmpPlayers.map((p) => {
          if (p.id === player.opponentId[i]) {
            buch = buch + p.score;
          }
        });
      }
      return { ...player, buchholz: buch };
    });

    console.log("Player changed Buchholz");
    console.log(tmpPlayers);


    const sortedPlayers = [...resPlayers].sort(comp).map((player, index) => ({
      ...player,
      rank: index + 1,
    }));

    console.log("Rank Sorted Players");
    console.log(sortedPlayers);

    setPlayersAndUpdateDatabase(sortedPlayers);
  };

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
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
