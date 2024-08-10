import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, createStore } from 'react-redux';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';
import '../../css/notebook/notebook-feedback.css'
import { createNewNote, sendFeedbackMessage } from '../../service/notebookPage';
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
  const isOpenSource = useSelector((state) => state.isOpenSource)
  const isNotify = useSelector((state) => state.isNotify)

  

  const formatMessage = (message) => {
    // Từ điển để lưu trữ các giá trị đã gặp và số thứ tự tương ứng
    const valueCounterMap = {};
    let counter = 1;

    // Mảng để lưu trữ các giá trị từ []
    const valueArray = [];

    // Mảng để lưu trữ các từ điển chứa chunk_id và content
    const chunkContentArray = [];

    // Hàm để lấy nội dung của chunkId và thêm xuống dòng sau mỗi dấu chấm
    const getContent = (id) => {
        const chunk = chunkContentArray.find(chunk => chunk.chunk_id === id);
        if (chunk) {
            return chunk.content;
        } else {
            const foundChunk = chunkId.find(chunk => chunk.chunk_id === id);
            if (foundChunk) {
                const content = foundChunk.content.replace(/\./g, '.\n');
                // Thêm vào mảng chunkContentArray nếu chưa có
                chunkContentArray.push({ chunk_id: id, content });
                return content;
            } else {
                return 'Nội dung không tìm thấy';
            }
        }
    };

    // Tìm tất cả các phần tử [] và lưu trữ chúng vào mảng nếu nội dung dài hơn 4 ký tự
    const regex = /\[([^\]]+)\]/g;
    let match;
    while ((match = regex.exec(message)) !== null) {
        // Tách các giá trị bên trong dấu ngoặc vuông
        const values = match[1].split(',').map(v => v.trim());
        values.forEach(value => {
            if (value.length > 4 && !valueArray.includes(value)) {
                valueArray.push(value);
            }
        });
    }

    // Hàm thay thế cho regex.replace
    const replacer = (match, p1) => {
        // Tách các giá trị bên trong dấu ngoặc vuông
        const values = p1.split(',').map(v => v.trim());
        return values.map(value => {
            if (value.length > 4) {
                if (!valueCounterMap[value]) {
                    valueCounterMap[value] = valueArray.indexOf(value) + 1;
                }
                const content = getContent(value);
                return `
                <button class="references-button" data-log="${value}">
                    ${valueCounterMap[value]}
                    <div class="references-panel">
                        <div>
                        ${content}
                        </div>
                    </div>
                </button>
                `;
            } else {
                return match; // Trả về chuỗi gốc nếu nội dung ngắn hơn hoặc bằng 4 ký tự
            }
        }).join(''); // Kết hợp các button vào cùng một chuỗi
    };

    // Thay thế các giá trị trong chuỗi gốc bằng các button
    const formattedMessage = message.replace(regex, replacer);

    return [formattedMessage, chunkContentArray];
};



function removeSquareBrackets(str) {
  return str.replace(/\[([^\]]+)\]/g, (match, content) => {
      // Nếu độ dài nội dung lớn hơn 4 ký tự, xóa nội dung trong dấu ngoặc vuông
      return content.length > 4 ? '' : match;
  });
}
  function getFileIdFromChunkId(chunk_id) {
    const chunk = chunkId.find(item => item.chunk_id === chunk_id);
      if (chunk) {
        return {
          file_id: chunk.file_id,
          content: chunk.content
        };
      } else {
        return null;
      }
  }

  const findReferences = (chunk_id) => {
    dispatch({
      type: 'FIND_REFERENCES',
      payload: {
        fileId: getFileIdFromChunkId(chunk_id).file_id,
        content: getFileIdFromChunkId(chunk_id).content
      }
    })
    if(!isOpenSource) {
      dispatch({ type: 'TOGGLE_SOURCE'})
    }
  }

  const handleButtonClick = (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.classList.contains('references-button')) {
      findReferences(event.target.getAttribute('data-log'))
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
      const data = createNewNote(notebookId, 'Ghi chú được lưu', removeSquareBrackets(normalString), formatMessage(normalString)[1])
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

  const handleOpenFeedback = () => {
    dispatch({
      type: 'TOGGLE_FEEDBACK'
    })
  }

  const handleLikeMessage = async () => {
    const userId = localStorage.getItem('userid')
    const feedbackLike = 'Câu trả lời tốt'
    try {
      const data = sendFeedbackMessage(userId, notebookId, feedbackLike)
      if (!isNotify) {
        dispatch({
          type: 'TOGGLE_NOTIFY'
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formatMessage(normalString)[0]).then(() => {
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
            <div dangerouslySetInnerHTML={{ __html: formatMessage(normalString)[0] }} />
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
            <div className="to-user-message-like" onClick={handleLikeMessage}>
              <i className="fa-regular fa-thumbs-up" />
            </div>
            <div className="to-user-message-dislike" onClick={handleOpenFeedback}>
              <i className="fa-regular fa-thumbs-down" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantMessage;
