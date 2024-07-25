import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/css/JoinEvent.css';
import Nav from '../common/Nav';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaInfoCircle, FaClipboardList } from 'react-icons/fa';

const JoinEvent = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTournamentExists, setIsTournamentExists] = useState(false);
  const navigate = useNavigate();

  const fetchTournaments = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/${id}/tournaments`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tournaments");
      }
      const data = await response.json();
      if (data.tournaments.length === 0) setIsTournamentExists(true);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
    }
  };

  useEffect(() => {
    fetchTournaments(user.id);
  }, [user.id]);

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

  const handleEventClick = (id) => {
    console.log(events);
    navigate(`/event/${id}/detail`, {state: {user: user, events: events}});
  };

  const handleJoinClick = async (eventId) => {
    await fetchTournaments(user.id);
    if(!isTournamentExists){
      alert('이미 신청 또는 참가중인 이벤트가 존재합니다.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/tournament/apply`, {
        method: 'POST',  // GET -> POST로 변경
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
      alert('접수 성공');  // 성공 알림
      // 추가적인 로직 처리 (예: 알림 표시 등)
    } catch (err) {
      console.error(err.message);
      alert('접수 실패: ' + err.message);  // 실패 알림
      // 에러 처리 (예: 알림 표시 등)
    }
  };


  const isBetweenDates = (startDate, endDate) => {
    const today = new Date();
    return today >= new Date(startDate) && today <= new Date(endDate);
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
                <img src={event.image_url} alt="event" />
                <div className="event-status">{isBetweenDates(event.start_date, event.end_date) ? "모집중" : "접수 종료됨"}</div>
              </div>
              <div className="join-event-details">
                <p><FaClipboardList className="icon" /> 이름: {event.name}</p>
                <p><FaCalendarAlt className="icon" /> 접수 기간: {new Date(event.start_date).toLocaleDateString()} ~ {new Date(event.end_date).toLocaleDateString()}</p>
                <p><FaCalendarAlt className="icon" /> 대회 기간: {new Date(event.round_start_date).toLocaleDateString()} ~ {new Date(event.round_end_date).toLocaleDateString()}</p>
                <p><FaMapMarkerAlt className="icon" /> 위치: {event.Location}</p>
                <p><FaUsers className="icon" /> 모집인원: {event.currentPeople}/{event.maxPeople}</p>
                <p><FaInfoCircle className="icon" /> 기타 정보: {event.description}</p>
                {isBetweenDates(event.start_date, event.end_date) && <button onClick={(e) => {e.stopPropagation(); handleJoinClick(event.id);}} className='event-participate'>참가신청</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JoinEvent;
