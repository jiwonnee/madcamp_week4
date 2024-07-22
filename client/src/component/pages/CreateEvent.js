import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/css/CreateEvent.css";
import Nav from "../common/Nav";

const CreateEvent = ({ user, addEvent }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [eventData, setEventData] = useState({
    date: "",
    location: "",
    participants: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      ...eventData,
      image: image,
      status: "모집 중",
    };

    const formData = new FormData();
    formData.append("name", newEvent["name"]);
    formData.append("details", newEvent["details"]);
    formData.append("startDate", newEvent["date"]);
    formData.append("endDate", newEvent["end-date"]);
    formData.append("location", newEvent["location"]);
    formData.append("maxPeople", newEvent["participants"]);
    formData.append("currentPeople", 0); // 초기값을 0으로 설정
    formData.append("createdBy", user.id);
    if (newEvent.image) {
      formData.append("image", newEvent.image);
    }

    try {

      const response = await fetch(
        "http://localhost:3001/api/tournament/create",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("Tournament created successfully:", result);
        navigate('/main', { state: { user: user } })
      } else {
        console.error("Error creating tournament:", result.message);
        // 실패 시 필요한 작업 수행
      }
    } catch (error) {
      console.error("Error:", error);
      // 예외 발생 시 필요한 작업 수행
    }
  };

  return (
    <div>
      <Nav user={user} />
      <h1 className="title">이벤트 개최하기</h1>
      <div className="create-event-container">
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="imageUpload">사진 업로드:</label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">이벤트 이름:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date">시작 날짜:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">종료 날짜:</label>
            <input
              type="date"
              id="end-date"
              name="end-date"
              value={eventData.end_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">위치:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="participants">모집인원:</label>
            <input
              type="text"
              id="participants"
              name="participants"
              value={eventData.participants}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="details">기타 정보:</label>
            <textarea
              id="details"
              name="details"
              value={eventData.details}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            업로드하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
