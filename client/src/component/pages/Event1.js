import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../../assets/styles/css/Event.css";
import Nav from "../common/Nav";
import EventNav from "../common/EventNav";
import { PlayerProvider } from "../contexts/PlayerInfo";
import { RoundProvider, useRound } from "../contexts/RoundInfo";

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
  const [selectedRound, setSelectedRound] = useState(null);

  useEffect(() => {
    const fetchRoundCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/tournament/${event.id}`
        );
        const data = await response.json();
        const roundCount = data.round_cnt;
        const buttons = Array.from({ length: roundCount }, (_, index) => (
          <button key={index} className="round-btn" onClick={() => setSelectedRound(index + 1)}>R{index + 1}</button>
        ));
        setRoundButtons(buttons);
      } catch (error) {
        console.error("Error fetching round count:", error);
      }
    };

    fetchRoundCount();
  }, [event.id, rounds]);

  const handleNextRoundStart = async () => {
    await addRound();
  };


  console.log(rounds);

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
              <p>이름: {event.name}</p>
              <p>접수 기간: {new Date(event.start_date).toLocaleDateString()} ~ {new Date(event.end_date).toLocaleDateString()}</p>
              <p>대회 기간: {new Date(event.round_start_date).toLocaleDateString()} ~ {new Date(event.round_end_date).toLocaleDateString()}</p>
              <p>위치: {event.Location}</p>
              <p>모집인원: {event.currentPeople}/{event.maxPeople}</p>
              <p>기타 정보: {event.description}</p>
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
            {roundButtons}
          </div>
          <h3>플레이어 메뉴</h3>
          <div className="button-container">
            <button>기권</button>
            {user.id === event.created_by && (
              <button onClick={handleNextRoundStart}>다음 라운드 개시</button>
            )}
            {user.id === event.created_by && (
              <button onClick={handleManageApplicationsClick}>
                참가 신청 관리
              </button>
            )}
          </div>
          {selectedRound && (
            <div className="round-info">
              <h4>Round {selectedRound} 정보</h4>
              <ul>
                {rounds
                  .filter(round => round.round_id === selectedRound)
                  .map(round => (
                    <li key={round.matchNum}>
                      Match {round.matchNum}: {round.player1Id} vs {round.player2Id? round.player2Id:"X"} (Score: {round.player1Res} - {round.player2Res})
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event1;