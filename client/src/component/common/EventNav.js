import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import '../../assets/styles/css/Event.css'; // CSS 파일 공유
import Nav from './Nav'; // Nav 컴포넌트를 현재 폴더로부터 가져옵니다

const EventNav = ({ user, events }) => {
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
        <Link 
          to={`/event/${id}/detail`} state={{ user, events }}  
          className={`event-nav-button ${location.pathname.includes('/detail') ? 'selected' : ''}`}
        >
          대회
        </Link>
        <Link 
          to={`/event/${id}/participants`} state={{ user, events }}
          className={`event-nav-button ${location.pathname.includes('/participants') ? 'selected' : ''}`}
        >
          참가자
        </Link>
        <Link 
          to={`/event/${id}/tournament`} state={{ user, events }} 
          className={`event-nav-button ${location.pathname.includes('/tournament') ? 'selected' : ''}`}
        >
          토너먼트
        </Link>
        <Link 
          to={`/event/${id}/notice`} state={{ user, events }}  
          className={`event-nav-button ${location.pathname.includes('/notice') ? 'selected' : ''}`}
        >
          공지
        </Link>
      </div>
    </div>
  );
};

export default EventNav;
