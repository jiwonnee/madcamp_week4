import React, { useEffect } from 'react';
import './css/LoadingPage.css'; // 스타일을 위한 CSS 파일

const LoadingPage = ({ onAnimationEnd }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 1800); // 1초 후에 onAnimationEnd 호출

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="loading-page">
      <h1 className="loading-text">All-Rounder</h1>
    </div>
  );
};

export default LoadingPage;
