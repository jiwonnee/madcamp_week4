import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import '../../assets/styles/css/Event.css'; // CSS 파일 공유
import Nav from '../common/Nav';
import EventNav from '../common/EventNav';

const Event2 = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, events } = location.state;
  const event = events.find(event => event.id === parseInt(id));

  console.log(user);
  console.log(events);

  if (!event) {
    return <div>이벤트를 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <EventNav user={user} events={events} />
    </div>
  );
};

export default Event2;
