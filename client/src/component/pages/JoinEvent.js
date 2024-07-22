import React from 'react';
import '../../assets/styles/css/JoinEvent.css';
import Nav from '../common/Nav';
import main1 from '../../assets/images/main1.jpeg';

const events = [
  {
    id: 1,
    image: main1,
    status: '모집 중',
    date: '2024-08-01',
    location: '서울',
    participants: '10/20',
    details: '기타 정보...'
  },
  {
    id: 2,
    image: main1,
    status: '모집 중',
    date: '2024-08-05',
    location: '부산',
    participants: '5/15',
    details: '기타 정보...'
  },
  {
    id: 3,
    image: main1,
    status: '모집 중',
    date: '2024-08-10',
    location: '대구',
    participants: '8/20',
    details: '기타 정보...'
  },
  {
    id: 4,
    image: main1,
    status: '모집 중',
    date: '2024-08-15',
    location: '광주',
    participants: '12/25',
    details: '기타 정보...'
  },
  {
    id: 5,
    image: main1,
    status: '모집 중',
    date: '2024-08-20',
    location: '대전',
    participants: '7/10',
    details: '기타 정보...'
  },
  {
    id: 6,
    image: main1,
    status: '모집 중',
    date: '2024-08-25',
    location: '울산',
    participants: '15/30',
    details: '기타 정보...'
  }
];

const JoinEvent = ({user}) => {
  return (
    <div>
      <Nav user={user}/>
      <div className="join-event-container">
        <h1 className="title">참가하기</h1>
        <div className="event-grid">
          {events.map(event => (
            <div className="event-card" key={event.id}>
              <div className="event-image">
                <img src={event.image} alt="event" />
                <div className="event-status">{event.status}</div>
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
