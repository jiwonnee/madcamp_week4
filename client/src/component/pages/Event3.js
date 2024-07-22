import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import '../../assets/styles/css/Event.css'; // CSS 파일 공유
import Nav from '../common/Nav';

const Event3 = ({ user, events }) => {
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
    </div>
  );
};

export default Event3;
