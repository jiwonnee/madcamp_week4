import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/css/JoinEvent.css';
import Nav from '../common/Nav';

const JoinEvent = ({ user, events }) => {
  const navigate = useNavigate();

  const handleEventClick = (id) => {
    navigate(`/event/${id}/detail`);
  };

  return (
    <div>
      <Nav user={user} />
      <div className="join-event-container">
        <h1 className="title">참가하기</h1>
        <div className="event-grid">
          {events.map(event => (
            <div className="event-card" key={event.id} onClick={() => handleEventClick(event.id)}>
              <div className="event-image">
                <img src={event.image} alt="event" />
              </div>
              <div className="event-details">
                <p>날짜: {event.date}</p>
                <p>위치: {event.location}</p>
                <p>모집인원: {event.participants}</p>
                <p>기타 정보: {event.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinEvent;
