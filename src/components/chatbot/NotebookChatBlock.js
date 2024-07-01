import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, createStore } from 'react-redux';

import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'

function NotebookChatBlock({ notebookId, selectedNotes, countSource }) {
  const [suggestQuestion, setSuggestQuestion] = useState([]);
  const [chatInput, setChatInput] = useState(null);
  const [newBotMessage, setNewBotMessage] = useState()
  const isChatOpen = useSelector((state) => state.isChatOpen);
  const dispatch = useDispatch();
  const conversations = useSelector(state => state.notebooks[notebookId] || []);

  const messageIndex = conversations.length;

  const addUserMessage = (notebookId, userMessage) => (
    dispatch({
      type: 'ADD_USER_MESSAGE',
      payload: { 
        notebookIdUser: notebookId, 
        userMessage: userMessage },
    })
  );
  const addBotMessage = (notebookId, botMessage) => (
    dispatch({
      type: 'ADD_BOT_MESSAGE',
      payload: { 
        notebookIdBot: notebookId, 
        botMessage: botMessage},
    })
  );

  const updateBotMessage = (notebookId, messageIndex, newContent) => {
    dispatch({
      type: 'UPDATE_BOT_MESSAGE',
      payload: { 
        notebookIdBot: notebookId, 
        messageIndex: messageIndex,
        newContent: newContent
      },
    })
  }
  const successBotChat = (messageIndex, newContent) => {
    dispatch({
      type: 'SET_SUCCESS_BOT_CHAT',
      payload: {
        messageIndex: messageIndex,
        content: newContent
      }
    })
  }

  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
  };

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await fetch(`http://localhost:3000/get-all-info-by-id/${notebookId}`);
        const data = await response.json();
        setSuggestQuestion(data.suggestions);
      } catch (error) {
        console.error('Error fetching notebooks:', error);
      }
    }
    fetchQuestion();
  }, [notebookId]);


  const handleInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(chatInput) {
      const initChat = 'Loading...'
      addUserMessage(notebookId, chatInput)
      addBotMessage(notebookId, initChat)

      setChatInput('')
      if(isChatOpen) {
        toggleChat()
      }
      try {
        const response = await fetch('http://localhost:3000/api/botchat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: chatInput }),
        });

        const data = await response.json();
        setNewBotMessage(data.reply)
        successBotChat(conversations.length + 2, data.reply)
        
        
      } catch (error) {
        console.error('Error submitting chat:', error);
      }
    }
    
  }; 
  useEffect(() => {
    console.log(conversations)
    console.log(newBotMessage)
  }, [conversations.length])


  return (
    <div className="notebook-chat-block allow-suggest">
      <div className={`notebook-chat-header ${selectedNotes.length > 0 ? 'tick-note-options' : ''}`}>
        {selectedNotes.length === 0 ? (
          suggestQuestion.map((suggest, index) => (
            <div key={index} className="notebook-chat-suggest">
              {suggest}
            </div>
          ))
        ) : (
          <div className='notebook-chat-options tick-note-options'>
            <div className={`tooltip notebook-chat-option-item ${selectedNotes.length === 1 ? '' : 'not-active'}`}>
              Giải thích
              <span className="tooltiptext">Giải thích ghi chú đã chọn</span>
            </div>
            <div className={`tooltip notebook-chat-option-item ${selectedNotes.length > 1 ? '' : 'not-active'}`}>
              Tóm tắt
              <span className="tooltiptext">Tóm tắt ghi chú đã chọn</span>
            </div>
            <div className={`tooltip notebook-chat-option-item ${selectedNotes.length === 1 ? '' : 'not-active'}`}>
              Phê bình
              <span className="tooltiptext">Phê bình ghi chú đã chọn</span>
            </div>
            <div className={`tooltip notebook-chat-option-item ${selectedNotes.length > 0 ? '' : 'not-active'}`}>
              Đề xuất ý tưởng có liên quan
              <span className="tooltiptext">
                Đề xuất ý tưởng từ các nguồn
              </span>
            </div>
            <div className={`tooltip notebook-chat-option-item ${selectedNotes.length > 1 ? '' : 'not-active'}`}>
              <i className="fa-regular fa-note-sticky"></i> Tạo hướng dẫn ôn tập
              <span className="tooltiptext">Tóm tắt ghi chú đã chọn</span>
            </div>
            <div className={`tooltip notebook-chat-option-item ${selectedNotes.length > 0 ? '' : 'not-active'}`}>
              <i className="fa-regular fa-note-sticky"></i> Tạo dàn ý
              <span className="tooltiptext">Tạo dàn ý từ ghi chú đã chọn</span>
            </div>
            <div className={`tooltip notebook-chat-option-item ${selectedNotes.length > 1 ? '' : 'not-active'}`}>
              <i className="fa-regular fa-note-sticky"></i> Kết hợp thành một ghi chú
              <span className="tooltiptext">Kết hợp thành một ghi chú</span>
            </div>
          </div>
        )}
      </div>
      <div className="notebook-chat-main">
        <div className="notebook-chat-open" onClick={toggleChat}>
          <i className="fa-regular fa-comments" />
          Xem cuộc trò chuyện
        </div>
        <div className="notebook-chat-main-input">
          <div className="notebook-chat-input-source">
            <span>
              {selectedNotes.length > 0
                ? `${selectedNotes.length} ghi chú`
                : `${countSource} nguồn`}
            </span>
          </div>
          <div className="notebook-chat-input-text">
            <form onSubmit={handleSubmit} className="notebook-chat-form">
              <input
                type="text"
                placeholder="Bắt đầu nhập..."
                className="notebook-chat-input"
                value={chatInput}
                onChange={handleInputChange}
              />
              <button type="submit" className="notebook-chat-form-button">
                <i className="fa-solid fa-arrow-right" />
              </button>
            </form>
          </div>
        </div>
        <div className="notebook-chat-tutorial">
          <i className="fa-regular fa-star" />
          Hướng dẫn về sổ tay
        </div>
      </div>
      <div className="notebook-chat-footer">
        Notebook PVI - Version 1.
      </div>
    </div>
  );
}

export default NotebookChatBlock;
