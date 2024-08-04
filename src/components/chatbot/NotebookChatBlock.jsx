import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, createStore } from 'react-redux';

import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'
import '../../css/notebook/notebook-tutorial.css'

import NotebookTutorial from './NotebookTutorial';
import { sendMessage } from '../../service/notebookPage';

function NotebookChatBlock({ notebookId, selectedNotes, countSource }) {
  const [suggestQuestion, setSuggestQuestion] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [classNotebookTutorial, setClassNotebookTutorial] = useState(false);
  const isChatOpen = useSelector((state) => state.isChatOpen);
  const isTutorialOpen = useSelector((state) => state.isTutorialOpen);
  const botchat = useSelector((state) => state.successBotChat)
  const conversations = useSelector(state => state.notebooks[notebookId] || []);
  const disableInput = countSource.length === 0;
  const [selectedFiles, setSelectedFile] = useState([])
  const dispatch = useDispatch();
  const [chunkId, setChunkId] = useState([])

  
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
        notebookId: notebookId, 
        messageIndex: messageIndex,
        newContent: newContent,
        newChunkId: chunkId
      },
    })
  }
  const successBotChat = (messageIndex, newContent, notebookId, chunkId) => {
    dispatch({
      type: 'SET_SUCCESS_BOT_CHAT',
      payload: {
        messageIndex,
        newContent,
        notebookId,
        chunkId
      }
    })
  }

  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
    if(isTutorialOpen){
      setClassNotebookTutorial(false)
      dispatch({ type: 'TOGGLE_TUTORIAL' });
    }
  };

  const toggleTutorial = () => {
    dispatch({ type: 'TOGGLE_TUTORIAL' });
    if(!isChatOpen) {
      dispatch({ type: 'TOGGLE_CHAT' });
    }
  };


  useEffect(() => {
    if(isTutorialOpen) {
      if(!isChatOpen) {
        toggleChat()
      }
      setClassNotebookTutorial(true)
    } else {
      setClassNotebookTutorial(false)
    }
  }, [isTutorialOpen])

  useEffect(() => {
    setSelectedFile(countSource.map(item => item.file_id));
  },[countSource])




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

  const handleQuestionClick = (questionText) => {
    console.log('Đã click vào câu hỏi:', questionText);
    getMessageFromChatbot(questionText)
  };

  const getMessageFromChatbot = async (chatInput) => {
    const initChat = 'Loading...'
    addUserMessage(notebookId, chatInput)
    addBotMessage(notebookId, initChat)

    setChatInput('')
    if(isChatOpen) {
      toggleChat()
    }
    try {
      const response = await sendMessage(notebookId, chatInput, selectedFiles);
      console.log(response)
      if(response.status === 200) {
        const botReply = response.data.message;
        const jsonString = response.data.context.replace(/'/g, '"');
        const chunkIds = JSON.parse(jsonString);
        chunkIds.map(chunkId => (
          dispatch({
            type: 'ADD_CHUNK_ID',
            payload: chunkId
          })
        ))
        successBotChat(conversations.length + 1, botReply, notebookId, chunkId)
      }
      
      
    } catch (error) {
      console.error('Error submitting chat:', error);
    }
  }

  const handleSubmit =(e) => {
    e.preventDefault();
    if(chatInput.trim()) {
      getMessageFromChatbot(chatInput)
    }
    
  }; 
  const handleSubmitSuggest = (suggest) => {
    getMessageFromChatbot(suggest)
  }
  useEffect(() => {
    if(botchat && botchat.notebookId === notebookId) {
      updateBotMessage(notebookId, botchat.messageIndex, botchat.newContent, botchat.notebookId)
    }
  }, [botchat])

  return (
    <>
    <NotebookTutorial notebookId={notebookId} closeTutorial={toggleTutorial} classOpen={classNotebookTutorial} onQuestionClick={handleQuestionClick}/>
    <div className={`notebook-chat-block allow-suggest ${isTutorialOpen ? 'notebook-chat-block-hide-header' : ''}`}
    >
      {
        !isTutorialOpen ? (
          <div className={`notebook-chat-header ${selectedNotes.length > 0 ? 'tick-note-options' : ''}`}>
          {selectedNotes.length === 0 ? (
            suggestQuestion.map((suggest, index) => (
              <div key={index} className={`notebook-chat-suggest ${countSource.length <= 0 ? 'notebook-chat-suggest-disabled' : ''}`} onClick={() => handleSubmitSuggest(suggest)}>
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
        ) : null
      }
     

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
                : `${countSource.length} nguồn`}
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
                disabled={disableInput}
              />
              <button type="submit" className="notebook-chat-form-button">
                <i className="fa-solid fa-arrow-right" />
              </button>
            </form>
          </div>
        </div>
        <div className="notebook-chat-tutorial" onClick={toggleTutorial}>
          <i className="fa-regular fa-star" />
          Hướng dẫn về sổ tay
        </div>
      </div>
      <div className="notebook-chat-footer">
        Notebook VPI - Version 1.
      </div>
    </div>
  </>

  );
}

export default NotebookChatBlock;
