import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import '../../assets/styles/css/Event.css';
import Nav from '../common/Nav';
import EventNav from '../common/EventNav';

const Event1 = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, events } = location.state; // location.state를 통해 전달된 데이터 받기

  const event = events.find(event => event.id === parseInt(id));

  if (!event) {
    return <div>이벤트를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <EventNav user={user} events={events} />
      <div className="event1-container">
        <div className="event-details">
          <div className="event-image">
            <img src={event.image_url} alt="event" />
          </div>
          <div className="event-info">
            <p>날짜: {new Date(event.start_date).toLocaleDateString()}</p>
            <p>위치: {event.location}</p>
            <p>모집인원: {event.maxPeople}</p>
            <p>기타 정보: {event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event1;
