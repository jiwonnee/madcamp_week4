import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/css/CreateEvent.css";
import Nav from "../common/Nav";
import Toast from "../common/Toast"; // Adjust the import path as needed

const CreateEvent = ({ user, addEvent }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [eventData, setEventData] = useState({
    date: "",
    endDate: "",
    roundStartDate: "",
    roundEndDate: "",
    location: "",
    participants: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

    if (new Date(eventData.date) > new Date(eventData.endDate)) {
      setToastMessage("유효하지 않은 날짜입니다: 접수 종료 날짜는 접수 시작 날짜 이후여야 합니다.");
      return;
    }

    if (new Date(eventData.roundStartDate) > new Date(eventData.roundEndDate)) {
      setToastMessage("유효하지 않은 날짜입니다: 대회 종료 날짜는 대회 시작 날짜 이후여야 합니다.");
      return;
    }

    if (new Date(eventData.endDate) > new Date(eventData.roundStartDate)) {
      setToastMessage("유효하지 않은 날짜입니다: 대회 시작 날짜는 접수 종료 날짜 이후여야 합니다.");
      return;
    }

    const newEvent = {
      ...eventData,
      image: image,
      status: "모집 중",
    };

    const formData = new FormData();
    formData.append("name", newEvent["name"]);
    formData.append("details", newEvent["details"]);
    formData.append("startDate", newEvent["date"]);
    formData.append("endDate", newEvent["endDate"]);
    formData.append("roundStartDate", newEvent["roundStartDate"]);
    formData.append("roundEndDate", newEvent["roundEndDate"]);
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
        navigate('/main', { state: { user: user } });
      } else {
        console.error("Error creating tournament:", result.message);
        // 실패 시 필요한 작업 수행
      }
    } catch (error) {
      console.error("Error:", error);
      // 예외 발생 시 필요한 작업 수행
    }
  };

  const handleToastClose = () => {
    setToastMessage('');
  };

  return (
    <div>
      <Nav user={user} />
      <h1 className="title">이벤트 개최하기</h1>
      <div className="create-event-container">
        {toastMessage && <Toast message={toastMessage} duration={1500} onClose={handleToastClose} />} {/* duration을 3000ms로 설정 */}
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="imageUpload">사진 업로드:</label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Image Preview" className="image-preview" />
            )}
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
            <label htmlFor="date">접수 시작 날짜:</label>
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
            <label htmlFor="endDate">접수 종료 날짜:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={eventData.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="roundStartDate">대회 시작 날짜:</label>
            <input
              type="date"
              id="roundStartDate"
              name="roundStartDate"
              value={eventData.roundStartDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="roundEndDate">대회 종료 날짜:</label>
            <input
              type="date"
              id="roundEndDate"
              name="roundEndDate"
              value={eventData.roundEndDate}
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
