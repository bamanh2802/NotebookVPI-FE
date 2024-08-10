import React, { useState } from 'react';
import '../../css/homepage/feedback.css'
import { sendFeedbackSystem } from '../../service/notebookPage';

const Feedback = ( {isOpenFeedback, closeFeedback }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);


  const handleChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleCloseFeedback = () => {
    closeFeedback()
    setSubmitted(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle feedback submission (e.g., send to server)
    const userId = localStorage.getItem('userid')
    try {
        const data = await sendFeedbackSystem(userId, feedback)
        console.log(data)
    } catch (e) {

    }
    setSubmitted(true);
    setFeedback('')
  };

  return (
    <div className={`feedback-container ${isOpenFeedback}`} onClick={handleCloseFeedback}>
      <div className='feedback-form' onClick={(e) => (e.stopPropagation())}>
            {submitted ? (
            <p className="feedback-message">Thank you for your feedback!</p>
            ) : (
            <form onSubmit={handleSubmit}>
                <textarea
                className="feedback-textarea"
                value={feedback}
                onChange={handleChange}
                placeholder="Your feedback here"
                rows="4"
                required
                />
                <br />
                <button type="submit" className="feedback-button">Submit</button>
            </form>
            )}
      </div>
    </div>
  );
};

export default Feedback;
