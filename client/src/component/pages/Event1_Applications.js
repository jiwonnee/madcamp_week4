import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../../assets/styles/css/Event.css';
import Nav from '../common/Nav';
import EventNav from '../common/EventNav';

const Event1_Applications = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, events } = location.state; // location.state를 통해 전달된 데이터 받기
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/tournament/${id}/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      console.log(data);
      setApplications(data.users);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [id]);

  const handleAccept = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/tournament/${id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to accept participation');
      }

      const data = await response.json();
      console.log(data.message);
      // 참가 수락 후 신청 목록을 다시 불러오기
      fetchApplications();
    } catch (err) {
      console.error(err.message);
      // 에러 처리 (예: 알림 표시 등)
    }
  };

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
        <h1>참가 신청 관리</h1>
        <div className="application-grid">
          {applications.map(application => (
            <div className="application-card" key={application.id}>
              <div className="application-info">
                <p>{application.following_userid}</p>
                <button onClick={() => handleAccept(application.id)} className='accept-button'>참가 수락</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Event1_Applications;
