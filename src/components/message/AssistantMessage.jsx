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
import '../../css/notebook/references.css'

const AssistantMessage = ({ onClickCloseChat, notebookId, message, isLoading }) => {
  const [isOpenFeedback, setIsOpenFeedback] = useState(false)
  const chunkId = useSelector(state => state.chunkId)
  const dispatch = useDispatch()
  const htmlContent = JSON.stringify(marked(message));
  const normalString = JSON.parse(htmlContent);
  const [hoveredDataLog, setHoveredDataLog] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    console.log(message)
    console.log(chunkId)
  },[chunkId])
  const formatMessage = (message) => {
    // Từ điển để lưu trữ các giá trị đã gặp và số thứ tự tương ứng
    const valueCounterMap = {};
    let counter = 1;

    // Mảng để lưu trữ các giá trị từ []
    const valueArray = [];

    // Hàm để lấy nội dung của chunkId và thêm xuống dòng sau mỗi dấu chấm
    const getContent = (id) => {
        const chunk = chunkId.find(chunk => chunk.chunk_id === id);
        if (chunk) {
            // Thay thế dấu chấm bằng dấu chấm cộng với xuống dòng
            return chunk.content.replace(/\./g, '.\n');
        } else {
            return 'Nội dung không tìm thấy';
        }
    };

    // Tìm tất cả các phần tử [] và lưu trữ chúng vào mảng
    const regex = /\[([^\]]+)\]/g;
    let match;
    while ((match = regex.exec(message)) !== null) {
        // Tách các giá trị bên trong dấu ngoặc vuông
        const values = match[1].split(',').map(v => v.trim());
        values.forEach(value => {
            if (!valueArray.includes(value)) {
                valueArray.push(value);
            }
        });
    }

    // Hàm thay thế cho regex.replace
    const replacer = (match, p1) => {
        // Tách các giá trị bên trong dấu ngoặc vuông
        const values = p1.split(',').map(v => v.trim());
        return values.map(value => {
            if (!valueCounterMap[value]) {
                valueCounterMap[value] = valueArray.indexOf(value) + 1;
            }
            const content = getContent(value);
            return `
            <button class="references-button" data-log="${value}" >${valueCounterMap[value]}
                <div class="references-panel">
                    <div>
                    ${content}
                    </div>
                </div>
            </button>
            `;
        }).join(''); // Kết hợp các button vào cùng một chuỗi
    };

    // Thay thế các giá trị trong chuỗi gốc bằng các button
    const formattedMessage = message.replace(regex, replacer);

    return formattedMessage;
};



  function removeSquareBrackets(str) {
    return str.replace(/\[.*?\]/g, '');
  }


  const handleButtonClick = (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('references-button')) {
      console.log(event.target.getAttribute('data-log'));
    }
  };

  const handleMouseEnter = (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('references-button')) {
      setHoveredDataLog(event.target.getAttribute('data-log'));
    }
  };

  const handleMouseLeave = (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('references-button')) {
      setHoveredDataLog(null);
    }
  };
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
      const data = createNewNote(notebookId, 'Ghi chú được lưu', removeSquareBrackets(normalString), 0)
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

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formatMessage(normalString)).then(() => {
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
          <div 
            onClick={handleButtonClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div dangerouslySetInnerHTML={{ __html: formatMessage(normalString) }} />
          </div>
            {hoveredDataLog && <div className="tooltip">{hoveredDataLog}</div>}
          {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown> */}
            <span className="pin-to-notebook" onClick={handleCreateNoteByMessage}>
              <i className="fa-solid fa-thumbtack" />
            </span>
          </div>
          <div className="to-user-message-footer" onClick={handleCopyMessage}>
            <div className="to-user-message-copy">
            <img src={copyIcon} alt="Copy" style={{ width: '20px', height: '20px', color:'#ccc' }} />
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
