import React, { useState } from 'react';

import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';

const AssistantMessage = ({ message }) => {
  const [isLoadingChat, setIsLoadingChat] = useState(false)


  return (
    <div className="to-user-message notebook-message">
      <div className="to-user-message-content">
        {message}
        <span className="pin-to-notebook">
          <i className="fa-solid fa-thumbtack" />
        </span>
      </div>
      <div className="to-user-message-footer">
        <div className="to-user-message-copy">
          <i className="fa-regular fa-copy" />
        </div>
        <div className="to-user-message-like">
          <i className="fa-regular fa-thumbs-up" />
        </div>
        <div className="to-user-message-dislike">
          <i className="fa-regular fa-thumbs-down" />
        </div>
      </div>
    </div>
    // <div className="chat-loading">
    //     <div className="dot"></div>
    //     <div className="dot"></div>
    //     <div className="dot"></div>
    //   </div>
      
  );
};

export default AssistantMessage;