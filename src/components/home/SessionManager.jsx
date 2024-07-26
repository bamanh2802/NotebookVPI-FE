import React, { useEffect, useState } from 'react';

const SessionManager = ({  }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [warning, setWarning] = useState(false);
  const sessionData = JSON.parse(localStorage.getItem('session_manager'))

  useEffect(() => {
    if (sessionData && sessionData.end_time) {
      const endTime = new Date(sessionData.end_time);
      const interval = setInterval(() => {
        const now = new Date();
        const remainingTime = endTime - now;
        console.log(remainingTime)

        if (remainingTime <= 0) {
          clearInterval(interval);
          setSessionExpired(true);
          // Xóa session_id
          localStorage.removeItem('session')
          const { session_id, ...rest } = sessionData;
          console.log('Session ID removed:', rest);
          // Thực hiện các hành động khác khi session hết hạn
        } else {
          setTimeRemaining(remainingTime);

          // Cảnh báo người dùng trước khi session hết hạn (ví dụ: 1 phút)
          if (remainingTime <= 60000 && !warning) {
            setWarning(true);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sessionData, warning]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      {sessionExpired ? (
        <p>Session has expired. Please log in again.</p>
      ) : (
        <p>Time remaining: {timeRemaining !== null ? formatTime(timeRemaining) : 'Calculating...'}</p>
      )}
      {warning && !sessionExpired && (
        <p style={{ color: 'red' }}>Your session is about to expire in less than a minute!</p>
      )}
    </div>
  );
};

export default SessionManager;