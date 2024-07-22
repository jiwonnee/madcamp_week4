import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CreateEvent.css';
import Nav from '../common/Nav';

const CreateEvent = ({ user, addEvent }) => {
  const [image, setImage] = useState(null);
  const [eventData, setEventData] = useState({
    date: '',
    location: '',
    participants: '',
    details: ''
  });

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      ...eventData,
      image: URL.createObjectURL(image),
      status: '모집 중'
    };
    addEvent(newEvent);
    navigate('/join_event');
  };

  return (
    <div>
      <Nav user={user} />
      <h1 className="title">이벤트 개최하기</h1>
      <div className="create-event-container">
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="imageUpload">사진 업로드:</label>
            <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="form-group">
            <label htmlFor="date">날짜:</label>
            <input type="date" id="date" name="date" value={eventData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="location">위치:</label>
            <input type="text" id="location" name="location" value={eventData.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="participants">모집인원:</label>
            <input type="text" id="participants" name="participants" value={eventData.participants} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="details">기타 정보:</label>
            <textarea id="details" name="details" value={eventData.details} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-button">업로드하기</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
