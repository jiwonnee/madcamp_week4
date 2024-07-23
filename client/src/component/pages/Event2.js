import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../assets/styles/css/Event.css';
import Nav from '../common/Nav';
import EventNav from '../common/EventNav';

const Event2 = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, events } = location.state; // location.state를 통해 전달된 데이터 받기
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/tournament/${id}/players`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }

      const data = await response.json();
      console.log(data);
      setPlayers(data.users);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <EventNav user={user} events={events} />
      <div className="applications-container">
        <h1>참가자 목록</h1>
        <div className="application-grid">
          {players.map(application => (
            <div className="application-card" key={application.id}>
              <div className="application-info">
                <p>{application.following_userid}</p>
                <button className='accept-button'>강제 추방</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Event2;
