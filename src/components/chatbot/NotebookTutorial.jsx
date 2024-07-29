import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, createStore } from 'react-redux';

import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'
import '../../css/notebook/notebook-tutorial.css'
import { createNewNote, sendMessage } from '../../service/notebookPage';


function NotebookTutorial({ notebookId, classOpen, onQuestionClick}) {
  const data = useSelector((state) => state.data);
  const allSourceByNotebook = useSelector((state) => state.allSourceByNotebook);
  const [selectedFiles, setSelectedFiles] = useState([])
  const dispatch = useDispatch();
  

  useEffect(() => {
    if(allSourceByNotebook.length > 0) {
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

  }, [allSourceByNotebook, data])


  const handleClick = (questionText) => {
    if (onQuestionClick) {
      onQuestionClick(questionText);
    }
  }
  
  const generateContentNote = async (request) => {
    try {
      const data = await sendMessage(notebookId, request, selectedFiles)
    } catch (e) {
      console.log(e)
    }
  }


  const handleCreateNewNote = async (message) => {
    const newNoteTemp = {
      notebookId: notebookId,
      noteId: 'tempId',
      title: 'Ghi chú mới',
      content: 'Đang tạo...',
      message: message,
      isChecked: false
    }
    dispatch({
      type: 'UPDATE_TEMP_NOTES',
      payload: newNoteTemp
    })
  };

    return (
        <div className={`notebook-tutorial ${classOpen}`}>
          <h1>Hướng dẫn về sổ tay</h1>
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
              <p>
                Đây là báo cáo cuối kỳ cho dự án Website Quản Lý Nhà Hàng, được thực
                hiện bởi một nhóm sinh viên trường Đại học Khoa Học Tự Nhiên, Đại học
                Quốc Gia Hà Nội. Báo cáo trình bày chi tiết về dự án, bao gồm giới thiệu
                chung, giải pháp kỹ thuật, thiết kế cơ sở dữ liệu, giao diện người dùng
                và chức năng của hệ thống. Hệ thống được xây dựng nhằm mục đích tối ưu
                hóa quy trình quản lý nhà hàng, từ quản lý nhân viên, thực đơn, nguyên
                liệu đến xử lý hóa đơn và báo cáo doanh thu. Báo cáo cũng đề cập đến kết
                quả đạt được và định hướng phát triển hệ thống trong tương lai.
              </p>
            </div>
            <div className="notebook-tutorial-section">
              <h2>Câu hỏi đề xuất</h2>
              <div className="notebook-tutorial-questions">
                <div className="notebook-tutorial-question" onClick={() => handleClick("Các tác nhân tương tác với hệ thống nhà hàng")}>
                  <i className="fa-regular fa-message" />
                  <span>
                    Các tác nhân (khách hàng, admin, đầu bếp) tương tác với hệ thống
                    quản lý nhà hàng này như thế nào?
                  </span>
                </div>
                <div className="notebook-tutorial-question" onClick={() => handleClick("Cơ sở dữ liệu của hệ thống quản lý nhà hàng này được cấu trúc như thế nào?")}>
                  <i className="fa-regular fa-message" />
                  <span>
                    Cơ sở dữ liệu của hệ thống quản lý nhà hàng này được cấu trúc như
                    thế nào?
                  </span>
                </div>
                <div className="notebook-tutorial-question" onClick={() => handleClick("Tầm nhìn và mục tiêu tương lai cho hệ thống quản lý nhà hàng")}>
                  <i className="fa-regular fa-message" />
                  <span>
                    Tầm nhìn và mục tiêu tương lai cho hệ thống quản lý nhà hàng
                    "DuMaThAn" là gì?
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

  };
   

export default NotebookTutorial