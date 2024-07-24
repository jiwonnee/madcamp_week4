import React, { useEffect } from 'react';
import '../../assets/styles/css/Toast.css';

const Toast = ({ message, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div className="toast">
      {message}
    </div>
  );
};

export default Toast;
