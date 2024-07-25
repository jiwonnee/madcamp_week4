import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/css/Main.css';
import '../../assets/styles/scss/buttons.scss';  
import logo from '../../assets/images/Khartes_Logo_Mini.png';
import Nav from '../common/Nav';

const Main = ({ user }) => {
  const navigate = useNavigate();
  const aboutSectionRef = useRef(null);
  const logoRef = useRef(null);
  const appnameRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const [isTournamentExists, setIsTournamentExists] = useState(false);

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        } else {
          entry.target.classList.remove('fade-in');
        }
      },
      { threshold: 0.5 }
    );

    if (aboutSectionRef.current) {
      observer.observe(aboutSectionRef.current);
    }

    return () => {
      if (aboutSectionRef.current) {
        observer.unobserve(aboutSectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Add animation classes after initial render
    if (logoRef.current && appnameRef.current) {
      setTimeout(() => {
        logoRef.current.classList.add('visible');
        appnameRef.current.classList.add('visible');
      }, 100); // Slight delay to ensure smooth animation
    }
    setTimeout(() => {
      if (buttonContainerRef.current) {
        buttonContainerRef.current.classList.add('visible');
      }
    }, 600); // Delay for buttons to appear after logo and appname
  }, []);

  const handleCreateClick = async () => {
    fetchTournaments(user.id);
    if(!isTournamentExists){
      alert('이미 신청 또는 참가중인 이벤트가 존재합니다.');
      return;
    }
    navigate('/create_event');
  }

  return (
    <div className="home">
      <Nav user={user} />
      <div className="main-container">
        <div className="intro-section">
          <img src={logo} alt="Khartes Logo" className="logo" ref={logoRef} />
          <p className="appname" ref={appnameRef}>All-Rounder</p>
          <div className="button-container" ref={buttonContainerRef}>
            <button className="main-button third" onClick={handleCreateClick}>이벤트 개최하기</button>
            <button className="main-button third" onClick={() => navigate('/join_event')}>이벤트 검색</button>
          </div>
        </div>
      </div>
      <div ref={aboutSectionRef} className="about-section">
        <div className="about-content">
          <h2 className="about-title">ABOUT</h2>
          <div className="about-description">
            <p>All-Rounder에 오신 것을 환영합니다. 저희 플랫폼은 이벤트를 관리하고 참여할 수 있는 궁극적인 플랫폼으로, 이벤트 주최자와 참가자 모두에게 포괄적인 솔루션을 제공합니다.</p>
            <p>All-Rounder를 통해 자신만의 이벤트를 생성하고 주최할 수 있으며, 관심 있는 이벤트를 검색하고 참여할 수 있습니다. 최신 이벤트 정보를 지속적으로 업데이트하며, 사용자 친화적인 인터페이스를 통해 이벤트의 모든 측면을 쉽게 관리할 수 있습니다. 등록부터 피드백 수집까지 모든 과정을 지원합니다.</p>
            <p>저희의 목표는 이벤트 관리를 원활하고 즐겁게 만드는 것입니다. 작은 커뮤니티 모임에서부터 대규모 컨퍼런스에 이르기까지, All-Rounder는 성공적인 이벤트를 위해 필요한 도구를 제공합니다.</p>
            <p>저희의 성장하는 이벤트 열광자 커뮤니티에 합류하여 All-Rounder의 편리함과 효율성을 경험해 보세요. 저희 플랫폼을 선택해 주셔서 감사합니다. 잊을 수 없는 이벤트를 만드는 데 도움이 되길 기대합니다!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
