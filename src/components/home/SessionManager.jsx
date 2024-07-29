import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

  
const SessionManager = ({  }) => {
  const [warning, setWarning] = useState(false);
  const [openNoti, setOpenNoti] = useState(false);
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
          setOpenNoti(true);
          const { session_id, ...rest } = sessionData;
        } else {

          if (remainingTime <= 60000 && !warning) {
            setWarning(true);
            toast('The login session is about to expire!',
              {
                style: {
                  borderRadius: '10px',
                },
              }
            );
          }
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [sessionData, warning]);

  const handleAcceptNoti = () => {
    localStorage.removeItem('session')
    localStorage.removeItem('session_manager')
    setOpenNoti(false);
    window.location.reload();
  }


  return (
    <>
      {openNoti && (
        <div className='session-check'>
          <div className='session-container'>
            <img src="https://cdn-icons-png.flaticon.com/512/6606/6606292.png" alt="" />

            <h3>Session has expired</h3>
            <p>Don't worry, just log in again to continue using</p>
          <button  onClick={handleAcceptNoti}>Refresh</button>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </>
    
  );
};

export default SessionManager;