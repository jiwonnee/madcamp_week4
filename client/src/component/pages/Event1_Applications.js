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



  useEffect(() => {
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

    fetchApplications();
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
        <h1>참가 신청 관리</h1>
        <ul>
          {applications.map(application => (
            <li key={application.id}>
              {application.following_userid}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Event1_Applications;
