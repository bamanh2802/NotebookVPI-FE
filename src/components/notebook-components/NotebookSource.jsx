

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getChunkIdByFileId, getContextById } from "../../service/notebookPage";
import { List } from 'react-content-loader';
import '../../css/notebook/sidebar.css';

const NotebookSource = ({ source, notebookId }) => {
  const dispatch = useDispatch();
  const [nameSource, setNameSource] = useState('');
  const [loadingContent, setLoadingContent] = useState(true);
  const findReferences = useSelector((state) => state.references);
  const isOpenSource = useSelector((state) => state.isOpenSource)
  const contentRef = useRef(null);
  const [highlightedContent, setHighlightedContent] = useState('');
  const [fileSelectedId, setFileSelectedId] = useState();
  const [chunkIdByFile, setChunkIdByFile] = useState([]);

  const closeSource = () => {
    dispatch({ type: 'TOGGLE_SOURCE' });
  };

  const getContentFile = async (fileId) => {
    setLoadingContent(true);
    setFileSelectedId(fileId);
    
    try {
        // Gọi API đầu tiên
        const contextData = await getContextById(notebookId, fileId);
        setNameSource(contextData.data.file.file_name)

        // Gọi API thứ hai
        const chunkData = await getChunkIdByFileId(notebookId, fileId);
        setChunkIdByFile(chunkData.data.chunks);

    } catch (e) {
        console.log('Error fetching data:', e);
    } finally {
        // Đảm bảo rằng loadingContent được đặt lại đúng cách
        setLoadingContent(false);
    }
};
 

  useEffect(() => {
    if (findReferences) {
      if (findReferences.fileId !== null && fileSelectedId !== findReferences.fileId) {
        getContentFile(findReferences.fileId);
      } else if (findReferences.fileId === null && source) {
        getContentFile(source.file_id);
      }
    }
  }, [findReferences, source]);

  const handleCloseSource = () => {
    dispatch({
      type: 'FIND_REFERENCES',
      payload: {
        fileId: null,
        content: null
      }
    });
    closeSource();
  };

  function formatAndHighlightContent(array, highlightChunkId) {
    // Tạo một biểu thức chính quy động để tìm nội dung cần highlight
    const highlightPattern = new RegExp(`(${array.map(item => item.chunk_id).join('|')})`, 'g');
  
    // Chuyển đổi mảng thành chuỗi với việc highlight chunkId
    const combinedContent = array.map(item => {
      return item.chunk_id === highlightChunkId
        ? `<span id="${item.chunk_id}" class="ref-highlight">${item.content}</span>`
        : item.content;
    }).join('\n');
  
    // Thực hiện các thay đổi trên chuỗi kết quả
    return combinedContent
      .replace(/(?:\r\n|\r|\n|\\n)/g, '<br />')
      .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng liên tiếp thành một khoảng trắng
      .replace(/ n /g, ' ') // Sửa lỗi chính tả
      .replace(/ đ /g, ' ') // Sửa lỗi chính tả
      .replace(/ s /g, ' ') // Sửa lỗi chính tả
      .replace(/\s*,\s*/g, ', ') // Chuẩn hóa dấu phẩy
      .replace(/\s*\(\s*/g, ' (') // Chuẩn hóa dấu ngoặc mở
      .replace(/\s*\)\s*/g, ') ') // Chuẩn hóa dấu ngoặc đóng
      .replace(/ {2,}/g, ' '); // Chuẩn hóa khoảng trắng liên tiếp
  }
  

  useEffect(() => {
    if (chunkIdByFile.length) {
      const chunkId = findReferences.chunkId;
      const result = formatAndHighlightContent(chunkIdByFile, chunkId);
      setHighlightedContent(result);
    }
  }, [chunkIdByFile, findReferences]);
    useEffect(() => {
      if (highlightedContent) {
        // Cuộn đến phần được highlight nếu có
        const element = document.getElementById(findReferences.chunkId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, [highlightedContent]);


  return (
    <>
      {source && (
        <>
          <div className="notebook-source">
            <div className="notebook-source-close" onClick={handleCloseSource}>
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="notebook-source-header">
              <span>{nameSource}</span>
            </div>
            <div className="notebook-source-main">
              {loadingContent ? (
                <>
                  <List backgroundColor={'#333'} foregroundColor={'#999'} />
                  <List backgroundColor={'#333'} foregroundColor={'#999'} />
                </>
              ) : (
                <div className="notebook-source-content" ref={contentRef}>
                  <div id="content" dangerouslySetInnerHTML={{ __html: highlightedContent }} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotebookSource;
