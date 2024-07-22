import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import '../../assets/styles/css/Event.css';
import Nav from '../common/Nav';

const Event1 = ({ user, events }) => {
  const { id } = useParams();
  const location = useLocation();
  const event = events.find(event => event.id === parseInt(id));

  if (!event) {
    return <div>이벤트를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <Nav user={user} />
      <div className="event-nav">
        <span className="nav-title">참가하기</span>
        <Link to={`/event/${id}/detail`} className={`event-nav-button ${location.pathname.includes('/detail') ? 'selected' : ''}`}>대회</Link>
        <Link to={`/event/${id}/participants`} className={`event-nav-button ${location.pathname.includes('/participants') ? 'selected' : ''}`}>참가자</Link>
        <Link to={`/event/${id}/tournament`} className={`event-nav-button ${location.pathname.includes('/tournament') ? 'selected' : ''}`}>토너먼트</Link>
        <Link to={`/event/${id}/notice`} className={`event-nav-button ${location.pathname.includes('/notice') ? 'selected' : ''}`}>공지</Link>
      </div>
      <div className="event1-container">
        <div className="event-details">
          <div className="event-image">
            <img src={event.image} alt="event" />
          </div>
          <div className="event-info">
            <p>날짜: {event.date}</p>
            <p>위치: {event.location}</p>
            <p>모집인원: {event.participants}</p>
            <p>기타 정보: {event.details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event1;
