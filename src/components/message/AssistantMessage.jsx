import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, createStore } from 'react-redux';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';
import '../../css/notebook/notebook-feedback.css'
import { createNewNote } from '../../service/notebookPage';
import copyIcon from '../../svg/copy.svg'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';

const AssistantMessage = ({ onClickCloseChat, notebookId, message, isLoading }) => {
  const [isOpenFeedback, setIsOpenFeedback] = useState(false)
  const chunkId = useSelector(state => state.chunkId)
  const dispatch = useDispatch()
  const htmlContent = JSON.stringify(marked(message));
  const normalString = JSON.parse(htmlContent);

  console.log(chunkId)

  const handleCreateNoteByMessage = async () => {
    const newNoteTemp = {
      notebookId: notebookId,
      noteId: 'tempId',
      title: 'Ghi chú được lưu',
      content: message,
      message: '',
      isChecked: false
    };
    dispatch({
      type: 'UPDATE_TEMP_NOTES',
      payload: newNoteTemp
    });
    onClickCloseChat()
    try {
      const data = createNewNote(notebookId, 'Ghi chú được lưu', message, 0)
      dispatch({
        type: 'REMOVE_TEMP_NOTES',
        payload: {
          notebookId: notebookId
        }
      });
    } catch (e) {
      console.log(e)
    } 
  }
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => {
        setCopySuccess('');
      }, 2000);
    }).catch((err) => {
      console.error('Error copying text: ', err);
    });
  };


  return (
    <>
      {isLoading ? (
        <div className="chat-loading">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      ) : (
        <div className="to-user-message notebook-message">
          <div className="to-user-message-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
            <span className="pin-to-notebook" onClick={handleCreateNoteByMessage}>
              <i className="fa-solid fa-thumbtack" />
            </span>
          </div>
          <div className="to-user-message-footer" onClick={handleCopyMessage}>
            <div className="to-user-message-copy">
            <img src={copyIcon} alt="Copy" style={{ width: '20px', height: '20px' }} />
            </div>
            <div className="to-user-message-like">
              <i className="fa-regular fa-thumbs-up" />
            </div>
            <div className="to-user-message-dislike">
              <i className="fa-regular fa-thumbs-down" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantMessage;
