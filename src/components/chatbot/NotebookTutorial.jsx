import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, createStore } from 'react-redux';

import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'
import '../../css/notebook/notebook-tutorial.css'
import { createNewNote, sendMessage } from '../../service/notebookPage';

import ContentLoader, { List } from 'react-content-loader'
import { marked } from 'marked';



function NotebookTutorial({ notebookId, closeTutorial, classOpen, onQuestionClick}) {
  const data = useSelector((state) => state.data);
  const allSourceByNotebook = useSelector((state) => state.allSourceByNotebook);
  const [selectedFiles, setSelectedFiles] = useState([])
  const dispatch = useDispatch();
  const [summary, setSumary] = useState('')
  const [suggestQuestions, setSuggestQuestions] = useState([])
  const [isStarted, setIsStarted] = useState(false)
  const stateSummary = useSelector(state => state.summaries[notebookId]);
  

  useEffect(() => {
    if(Object.keys(allSourceByNotebook).length !== 0) {
      if (allSourceByNotebook.countSource.length > 0) {

        if(data.countSource.length === 0) {
            setSelectedFiles(allSourceByNotebook.countSource.map(item =>(
            item.file_id
          )))
          } else {
            setSelectedFiles(data.countSource.map(item =>(
            item.file_id
          )))
          }
      }
    }

  }, [allSourceByNotebook, data])

  useEffect(() => {
    if (classOpen) {
      if(Object.keys(allSourceByNotebook).length !== 0) {
        if (allSourceByNotebook.countSource.length > 0) {
          if (!stateSummary) {
            getSumary()
          } else {
            setSumary(stateSummary)
            setIsStarted(true)
          }
        }
      }
    }
  }, [classOpen])

  const formatMessage = (message) => {
    return message
      .replace(/\\n/g, '') // Loại bỏ \n
      .replace(/&quot;/g, '"'); // Thay thế &quot; bằng dấu ngoặc kép
  };

  const getSumary = async () => {
    const allIdFiles = allSourceByNotebook.countSource.map(item =>(
      item.file_id
    ))
    if(allIdFiles.length > 0) {
      setIsStarted(true)
      try {
        const data = await sendMessage(notebookId, 'Tóm tắt dữ liệu trong các file', allIdFiles)
        
        if(data.status === 200) {
          const htmlContent = JSON.stringify(marked(data.data.message));
          const normalString = JSON.parse(htmlContent);
          const totalSumary = removeSquareBrackets(normalString)
          setSumary(totalSumary)
          dispatch({
            type: 'SET_SUMMARY',
            payload: {notebookId, summary: totalSumary}
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }



  const handleClick = (questionText) => {
    if (onQuestionClick) {
      onQuestionClick(questionText);
    }
  }
  function removeSquareBrackets(str) {
    return str.replace(/\[.*?\]/g, '');
  }

  const removeTempNote = () => {
    dispatch({
      type: 'REMOVE_TEMP_NOTES',
      payload: {
        notebookId: notebookId
      }
    });
  }
  
  const generateContentNote = async (message) => {
    try {
      const data = await sendMessage(notebookId, message, selectedFiles);
      const htmlContent = JSON.stringify(marked(data.data.message));
      const normalString = JSON.parse(htmlContent);
      if (data.status === 200) {
        try {
          const newNote = await createNewNote(notebookId, message, removeSquareBrackets(normalString), []);
          if(newNote.status === 200) {
            removeTempNote()
          }
        } catch (e) {
          console.log(e)
        }
      }
    } catch (e) {
      console.log(e);
      removeTempNote()
    }
  };
  
  const handleCreateNewNote = async (message) => {
    const newNoteTemp = {
      notebookId: notebookId,
      noteId: 'tempId',
      title: 'Ghi chú mới',
      content: 'Đang tạo...',
      message: message,
      isChecked: false,
      references: []
    };
    dispatch({
      type: 'UPDATE_TEMP_NOTES',
      payload: newNoteTemp
    });
    closeTutorial();
  
    try {
      await generateContentNote(message);
    } catch (error) {
      console.error('Lỗi khi tạo note mới:', error);
    }
  };

    return (
        <div className={`notebook-tutorial ${classOpen ? 'notebook-tutorial-opened' : 'notebook-tutorial-closed'}`}>
          <h1>Hướng dẫn về sổ tay</h1>
          {
            isStarted ? (
              <>
                <div className="notebook-tutorial-header">
            <h2>Tạo</h2>
            <div className="notebook-tutorial-cards">
              <div className="notebook-tutorial-card" onClick={() => handleCreateNewNote('Câu hỏi thường gặp')}>
                <i className="fa-regular fa-note-sticky" />
                <span>Câu hỏi thường gặp</span>
              </div>
              <div className="notebook-tutorial-card" onClick={() => handleCreateNewNote('Hướng dẫn ôn tập')}>
                <i className="fa-regular fa-note-sticky" />
                <span>Hướng dẫn ôn tập</span>
              </div>
              <div className="notebook-tutorial-card" onClick={() => handleCreateNewNote('Mục lục')}>
                <i className="fa-regular fa-note-sticky" />
                <span>Mục lục</span>
              </div>
              <div className="notebook-tutorial-card" onClick={() => handleCreateNewNote('Tài liệu tóm tắt')}>
                <i className="fa-regular fa-note-sticky" />
                <span>Tài liệu tóm tắt</span>
              </div>
            </div>
          </div>
          <div className="notebook-tutorial-footer">
            <div className="notebook-tutorial-summary">
              <h2>Tóm tắt</h2>
                {summary ? (
                  <div>
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(summary) }} />
                  </div>
                ) : (
                <List backgroundColor={'#333'}
                      foregroundColor={'#999'}/>
                )}
            </div>
            <div className="notebook-tutorial-section">
              <h2>Câu hỏi đề xuất</h2>
              <div className="notebook-tutorial-questions">
              {suggestQuestions.length !== 0 ? (
                suggestQuestions.map(question => (
                <div className="notebook-tutorial-question" onClick={() => handleClick(question.content)}>
                  <i className="fa-regular fa-message" />
                  <span>
                    {question.content}
                  </span>
                </div>
                ))
              ) : (
                <List backgroundColor={'#333'}
                      foregroundColor={'#999'}/>
                )}
              </div>
            </div>
          </div>
              </>
            ) : (
              <>
                <div>
                  Thêm nguồn để bắt đầu
                </div>
              </>
            )
          }
        </div>
      )

  };
   

export default NotebookTutorial