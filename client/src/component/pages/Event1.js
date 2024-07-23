import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../../assets/styles/css/Event.css";
import Nav from "../common/Nav";
import EventNav from "../common/EventNav";

const Event1 = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, events } = location.state; // location.state를 통해 전달된 데이터 받기

  const event = events.find((event) => event.id === parseInt(id));

  if (!event) {
    return <div>이벤트를 찾을 수 없습니다.</div>;
  }

  const roundButtons = Array.from({ length: event.round_num }, (_, index) => (
    <button key={index}>R{index + 1}</button>
  ));

  const handleManageApplicationsClick = () => {
    navigate(`/event/${event.id}/detail/applications`, { state: { user, events } });
  };

  const handleJoinClick = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tournament/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tournament_id: eventId, user_id: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply participation');
      }

      const data = await response.json();
      console.log(data.message);
      alert('참가 신청 성공'); // 성공 알림
      // 추가적인 로직 처리 (예: 알림 표시 등)
    } catch (err) {
      console.error(err.message);
      alert('참가 신청 실패: ' + err.message); // 실패 알림
      // 에러 처리 (예: 알림 표시 등)
    }
  };

  const isBetweenDates = (startDate, endDate) => {
    const today = new Date();
    return today >= new Date(startDate) && today <= new Date(endDate);
  };

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
              {isBetweenDates(event.start_date, event.end_date) && <button onClick={() => handleJoinClick(event.id)} className='event-participate'>참가신청</button>}
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
            {user.id === event.created_by && <button>다음 라운드 개시</button>}
            {user.id === event.created_by && <button onClick={handleManageApplicationsClick}>참가 신청 관리</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event1;
