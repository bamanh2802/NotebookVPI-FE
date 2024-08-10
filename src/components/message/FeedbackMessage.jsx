import React, { useState } from 'react';
import '../../css/homepage/feedback.css'
import { sendFeedbackMessage } from '../../service/notebookPage';
import { useDispatch, useSelector } from 'react-redux';


const FeedbackMessage = ({notebookId}) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [otherFeedback, setOtherFeedback] = useState('');
    const dispatch = useDispatch()
    const isNotify = useSelector((state) => state.isNotify)
  
    const handleOptionClick = (value) => {
      setSelectedOptions(prevOptions => 
        prevOptions.includes(value) 
          ? prevOptions.filter(option => option !== value) 
          : [...prevOptions, value]
      );
    };
  
    const handleOtherFeedbackChange = (event) => {
      setOtherFeedback(event.target.value);
    };
  
const handleSubmit = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem('userid')
    const optionsString = selectedOptions.join(', ');
    const feedbackString = `Tùy chọn đã chọn: ${optionsString}\nÝ kiến khác: ${otherFeedback}`;
    try{
        const data = await sendFeedbackMessage(userId, notebookId, feedbackString)
        console.log(data)
        dispatch({
            type: 'TOGGLE_FEEDBACK'
          })
        if(!isNotify) {
        dispatch({
            type: 'TOGGLE_NOTIFY'
            })
        }
    } catch (e) {
        console.log(e)
        dispatch({
            type: 'TOGGLE_FEEDBACK'
          })
    }
    console.log('Feedback String:', feedbackString);
};
  
    return (
      <div className="feedback-message-message" onClick={(e) => (e.stopPropagation())}>
        <h2 className="feedback-message-title">Gửi phản hồi</h2>
        <form className="feedback-message-form" onSubmit={handleSubmit}>
          <div className="feedback-message-options">
            {["Phản cảm/ không an toàn", "Không liên quan", "Không đúng sự thật", "Không trả lời được", "Không chính xác 1 phần", "Khác"].map(option => (
              <label 
                className={`feedback-message-option ${selectedOptions.includes(option) ? 'selected' : ''}`} 
                key={option} 
                onClick={() => handleOptionClick(option)}
              >
                <input
                  type="checkbox"
                  value={option}
                  className="feedback-message-checkbox"
                  checked={selectedOptions.includes(option)}
                />
                {option}
              </label>
            ))}
          </div>
  
          {selectedOptions.includes("Khác") && (
            <div className="feedback-message-other-feedback">
              <label className="feedback-message-other-feedback-label">
                Ý kiến khác:
                <textarea
                  value={otherFeedback}
                  onChange={handleOtherFeedbackChange}
                  placeholder="Nhập ý kiến của bạn ở đây..."
                  className="feedback-message-other-feedback-textarea"
                />
              </label>
            </div>
          )}
  
          <div className="feedback-message-submit">
            <span className="feedback-message-submit-text" onClick={handleSubmit}>Gửi phản hồi</span>
          </div>
        </form>
      </div>
    );
  };
  
  export default FeedbackMessage;
  