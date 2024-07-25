import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../../assets/styles/css/Event.css";
import Nav from "../common/Nav";
import EventNav from "../common/EventNav";
import { PlayerProvider } from "../contexts/PlayerInfo";
import { RoundProvider, useRound } from "../contexts/RoundInfo";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaInfoCircle, FaClipboardList } from 'react-icons/fa';

const Event1 = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, events } = location.state; // location.state를 통해 전달된 데이터 받기

  const event = events.find((event) => event.id === parseInt(id));

  if (!event) {
    return <div>이벤트를 찾을 수 없습니다.</div>;
  }

  const handleManageApplicationsClick = () => {
    navigate(`/event/${event.id}/detail/applications`, {
      state: { user, events },
    });
  };

  return (
    <PlayerProvider tournament_id={id}>
      <RoundProvider tournament_id={id}>
        <Event1Content
          user={user}
          events={events}
          event={event}
          handleManageApplicationsClick={handleManageApplicationsClick}
        />
      </RoundProvider>
    </PlayerProvider>
  );
};

const Event1Content = ({
  user,
  events,
  event,
  handleManageApplicationsClick,
}) => {
  const { addRound, rounds } = useRound();
  const [roundButtons, setRoundButtons] = useState([]);
  const [rankButtons, setRankButtons] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [selectedTab, setSelectedTab] = useState("round"); // 새로운 상태 추가
  const [userNames, setUserNames] = useState({});
  const [players, setPlayers] = useState([]);

  let fetchRoundCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/tournament/${event.id}`
      );
      const data = await response.json();
      const roundCount = data.round_cnt;
      const roundbuttons = Array.from({ length: roundCount }, (_, index) => (
        <button key={index} className="round-btn" onClick={() => {setSelectedRound(index + 1); setSelectedTab("round");}}>R{index + 1}</button>
      ));
      const rankbuttons = 
        <button className="round-btn" onClick={() => {setSelectedTab("rank");}}>현재 순위</button>;
      setRoundButtons(roundbuttons);
      setRankButtons(rankbuttons);
    } catch (error) {
      console.error("Error fetching round count:", error);
    }
  };

  useEffect(() => {
    fetchRoundCount();
  }, [event.id, rounds]);

  useEffect(() => {
    const fetchUserName = async (userId) => {
      try {
        if(userId == -1) return "X";
        const response = await fetch(`http://localhost:3001/api/users/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        return data.user.following_userid;
      } catch (error) {
        console.error("Error fetching user:", error);
        return "Unknown";
      }
    };

    if (selectedRound !== null) {
      const fetchUserNames = async () => {
        const userIds = new Set();
        rounds
          .filter((round) => round.round_id === selectedRound)
          .forEach((round) => {
            userIds.add(round.player1Id);
            if (round.player2Id) userIds.add(round.player2Id);
          });

        const names = {};
        for (const userId of userIds) {
          names[userId] = await fetchUserName(userId);
        }
        setUserNames(names);
      };

      fetchUserNames();
    }
  }, [selectedRound, rounds]);

  const handleNextRoundStart = async () => {
    await addRound();
    fetchRoundCount();
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/tournament/${event.id}/players_moreInfo`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setPlayers(data.players);
        return data.players;
      } catch (error) {
        
      }
    }

    fetchPlayers();
  })

  return (
    <div>
      <EventNav user={user} events={events} />
      <div className="container">
        <div className="event1-container">
          <div className="event-details">
            <div className="event-image">
              <img src={event.image_url} alt="event" />
            </div>
            <div className="event-info">
              <p><FaClipboardList className="icon" /> 이름: {event.name}</p>
              <p><FaCalendarAlt className="icon" /> 접수 기간: {new Date(event.start_date).toLocaleDateString()} ~ {new Date(event.end_date).toLocaleDateString()}</p>
              <p><FaCalendarAlt className="icon" /> 대회 기간: {new Date(event.round_start_date).toLocaleDateString()} ~ {new Date(event.round_end_date).toLocaleDateString()}</p>
              <p><FaMapMarkerAlt className="icon" /> 위치: {event.Location}</p>
              <p><FaUsers className="icon" /> 모집인원: {event.currentPeople}/{event.maxPeople}</p>
              <p><FaInfoCircle className="icon" /> 기타 정보: {event.description}</p>
            </div>
          </div>
        </div>
        <div className="right-content">
          <h3>라운드별 대진</h3>
          <div className="button-container">
            {roundButtons}
          </div>
          <h3>라운드별 순위</h3>
          <div className="button-container">
            {rankButtons}
          </div>
          {user.id === event.created_by && (<h3>플레이어 메뉴</h3>)}
          <div className="button-container">
            {user.id === event.created_by && (
              <button onClick={handleNextRoundStart}>다음 라운드 개시</button>
            )}
            {user.id === event.created_by && (
              <button onClick={handleManageApplicationsClick}>
                참가 신청 관리
              </button>
            )}
          </div>
          {(
            <div className="round-info">
              {selectedTab === "round" && (
                <>
                  <h4>Round {selectedRound} 정보</h4>
                  <ul>
                    {rounds
                      .filter((round) => round.round_id === selectedRound)
                      .map((round) => (
                        <li key={round.matchNum}>
                          Match {round.matchNum}: {userNames[round.player1Id]} vs {round.player2Id ? userNames[round.player2Id] : "X"} (Score: {round.player1Res} - {round.player2Res})
                        </li>
                      ))}
                  </ul>
                </>
              )}
              {selectedTab === "rank" && (
                <>
                  <h4>현재 순위</h4>
                  {/* players 배열을 player.rank 순으로 정렬하여 표시 */}
                  <ul>
                    {players
                      .sort((a, b) => a.player_rank - b.player_rank)
                      .map((player) => (
                        <li>
                          {player.player_rank}. {player.following_userid}: {player.win} 승 {player.lose} 패
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event1;
