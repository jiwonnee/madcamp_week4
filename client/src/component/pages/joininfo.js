import React, { useState, useEffect } from "react";
import Nav from "../common/Nav";
import { PlayerProvider, usePlayer } from "../contexts/PlayerInfo";
import { RoundProvider, useRound } from "../contexts/RoundInfo";
import "../../assets/styles/css/JoinInfo.css";

const JoinInfoContent = ({ user, selectedTournament }) => {
  const [matches, setMatches] = useState([]);
  const [selectedResult, setSelectedResult] = useState("");
  const [userNames, setUserNames] = useState({});

  const { updateMatch } = useRound();

  useEffect(() => {
    if (selectedTournament) {
      const fetchMatches = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/tournament/${selectedTournament.id}/matches`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ round_id: selectedTournament.round_cnt }),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch matches");
          }
          const data = await response.json();

          // 필터링하여 user.id가 player1Id나 player2Id에 포함되지 않은 항목 제거
          const filteredMatches = data.matches.filter(
            (match) =>
              match.player1Id === user.id || match.player2Id === user.id
          );

          setMatches(filteredMatches);
        } catch (err) {
          console.error("Error fetching matches:", err);
        }
      };

      fetchMatches();
    }
  }, [selectedTournament]);

  useEffect(() => {
    const fetchUserNames = async (userIds) => {
      const names = {};
      for (const userId of userIds) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/users/${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          const data = await response.json();
          names[userId] = data.user.following_userid;
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setUserNames(names);
    };

    if (matches.length > 0) {
      const userIds = new Set();
      matches.forEach((m) => {
        userIds.add(m.player1Id);
        if (m.player2Id) userIds.add(m.player2Id);
      });
      fetchUserNames(userIds);
    }
  }, [matches]);

  const handleResultChange = (result) => {
    setSelectedResult(result);
  };

  const handleSubmit = async () => {
    if (selectedResult === "") return;

    const [player1Score, player2Score] = selectedResult.split("-").map(Number);

    const newRes = {
      ...matches[0],
      player1Res: player1Score,
      player2Res: player2Score,
    };

    console.log(newRes);

    await updateMatch(matches[0].round_id, matches[0].matchNum, newRes);

    //   try {
    //     const response = await fetch(
    //       `http://localhost:3001/api/tournament/${selectedTournament.id}/submitResult`,
    //       {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           result: newRes,
    //         }),
    //       }
    //     );

    //     if (!response.ok) {
    //       throw new Error("Failed to submit results");
    //     }

    //     const data = await response.json();
    //     console.log(data.message);
    //   } catch (err) {
    //     console.error("Error submitting results:", err);
    //   }
  };

  return (
    <div>
      <Nav user={user} />
      <h1 className="title">참여 정보</h1>
      <div className="join-info-container">
        <h1>참여 정보</h1>
        <h2>대회명: {selectedTournament.name}</h2>
        {matches.length > 0 && (
          <h3>
            {matches[0].round_id} 라운드 Match {matches[0].matchNum}
          </h3>
        )}
        {matches.length > 0 && matches[0].player2Id != -1 && matches[0].player2Id != null && (
          <div className="matches">
            {matches.map((m) => (
              <div className="match" key={m.id}>
                <p>
                  {userNames[m.player1Id]} vs{" "}
                  {m.player2Id ? userNames[m.player2Id] : "X"}
                </p>
                <select
                  value={selectedResult}
                  onChange={(e) => handleResultChange(e.target.value)}
                >
                  <option value="">결과를 선택하세요</option>
                  <option value="2-2">승-승</option>
                  <option value="2-1">승-무</option>
                  <option value="2-0">승-패</option>
                  <option value="1-2">무-승</option>
                  <option value="1-1">무-무</option>
                  <option value="1-0">무-패</option>
                  <option value="0-2">패-승</option>
                  <option value="0-1">패-무</option>
                  <option value="0-0">패-패</option>
                </select>
              </div>
            ))}
            <button onClick={handleSubmit}>결과 제출</button>
          </div>
        )}
        {matches.length > 0 && (matches[0].player2Id == -1 || matches[0].player2Id == null) && (
          <div className="matches">
            <div className="match" key={matches[0].id}>
              <p>
                {userNames[matches[0].player1Id]} vs {"X"}
              </p>
              <p>
                당신은 부전승입니다. 부전승은 경기 결과를 수정할 수 없습니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const JoinInfo = ({ user }) => {
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${user.id}/tournaments`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tournaments");
        }
        const data = await response.json();
        if (data.tournaments.length === 0) setSelectedTournament(null);
        else setSelectedTournament(data.tournaments[0]);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
      }
    };

    fetchTournaments();
  }, [user.id]);

  if (!selectedTournament) {
    return (
      <div>
        <Nav user={user} />
        <div className="join-info-container">
          <h1>참여 정보</h1>
          <p>참가한 토너먼트가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <PlayerProvider tournament_id={selectedTournament.id}>
      <RoundProvider tournament_id={selectedTournament.id}>
        <JoinInfoContent user={user} selectedTournament={selectedTournament} />
      </RoundProvider>
    </PlayerProvider>
  );
};

export default JoinInfo;
