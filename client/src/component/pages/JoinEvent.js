import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/css/JoinEvent.css';
import Nav from '../common/Nav';

const JoinEvent = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tournament/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) { 
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        console.log(data.events);
        setEvents(data.events);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Nav user={user} />
      <div className="join-event-container">
        <h1 className="title">참가하기</h1>
        <div className="event-grid">
          {events.map(event => (
            <div className="event-card" key={event.id} onClick={() => handleEventClick(event.id)}>
              <div className="event-image">
                <img src={event.image_url} alt="event" />
                <div className="event-status">{event.isOpen? "모집중" : "종료됨"}</div>
              </div>
              <div className="event-details">
                <p>날짜: {event.start_date}</p>
                <p>위치: {event.Location}</p>
                <p>모집인원: {event.maxPeople}</p>
                <p>기타 정보: {event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinEvent;
