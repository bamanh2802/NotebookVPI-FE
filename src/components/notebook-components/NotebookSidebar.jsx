import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NotebookSource  from './NotebookSource';
import axios from 'axios';
import { fetchSourceNotebook } from '../../service/notebookPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'

function NotebookSidebar({ notebookId }) {
    const [allSources, setAllSources] = useState([]);
    const [selectAll, setSelectAll] = useState(true); // Set selectAll to true by default
    const [countSource, setCountSource] = useState([]);
    const [sourceSelector, setSouceSelector] = useState()
    const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
    const [fileNames, setFileNames] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sourceListSelector, setSourceListSelector] = useState([])
    const [uploadStatus, setUploadStatus] = useState({});


    const dispatch = useDispatch();
    const isOpenSidebar = useSelector((state) => state.isOpenSidebar);
    const isOpenSource = useSelector((state) => state.isOpenSource)

    const fileInputRef = useRef(null);

    const handleOpenUploadFile = () => {
        setIsOpenUploadFile(true)
    };
    const handleCloseUploadFile = () => {
        setIsOpenUploadFile(false)

    }


    const data = { 
        notebookId: notebookId,
        countSource: countSource
    };
    const listFilesNotebook = {
        notebookId: notebookId,
        countSource: allSources
    }

    useEffect(() => {
        dispatch({ type: 'UPDATE_DATA', payload: data });
    }, [dispatch, data]);
    useEffect(() => {
        dispatch({ type: 'UPDATE_FILES', payload: listFilesNotebook });

    })
    useEffect(() => {
        if(allSources.length === countSource){
        }
    }, [countSource])


    const handleToggleSidebar = () => {
        dispatch({ type: 'TOGGLE_SIDEBAR' })
    }

    const handleToggleSource = () => {
        dispatch({ type: 'TOGGLE_SOURCE'})
    }

    const handleOpenSource = (source) => {
        handleToggleSource();
        setSouceSelector(source)
    }

    const fetchAllSources = async () => {
        try {
            const data = await fetchSourceNotebook(notebookId)
            if(data.length === 0) {
                setIsOpenUploadFile(true)
            }
            const dataSort = data.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at))
            setAllSources(dataSort.map(source => ({ ...source, isSelected: true }))); 
            setSourceListSelector(dataSort)
            setCountSource(dataSort)
        } catch (error) {
            console.log('Get source Error: ', error)
        }
        
    }

    const fetchAllSourcesAgain = async () => {
        try {
          const data = await fetchSourceNotebook(notebookId);
      
          if (data.length === 0) {
            setIsOpenUploadFile(true);
          }
      
          const dataSort = data.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
      
          const updatedSources = dataSort.map(source => {
            const found = sourceListSelector.find(s => s.file_id === source.file_id);
            return {
              ...source,
              isSelected: found ? found.isSelected : true, // Giữ trạng thái của các tệp đã có, các tệp mới sẽ được chọn mặc định
            };
          });
      
          setAllSources(updatedSources);
          setSourceListSelector(updatedSources);
          setCountSource(updatedSources);
        } catch (error) {
          console.log('Get source Error: ', error);
        }
      };
    

    useEffect(() => {
        fetchAllSources()
        
    }, [notebookId]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setAllSources(prevSources => prevSources.map(source => ({ ...source, isSelected: !selectAll })));
        setCountSource(selectAll ? [] : allSources);
    };

    const handleSourceSelect = (sourceId) => {
        setAllSources(prevSources => {
            const newSources = prevSources.map(source => (
                source.file_id === sourceId
                    ? { ...source, isSelected: !source.isSelected }
                    : source
            ));
            
            const selectedSources = newSources.filter(source => source.isSelected);
            setCountSource(selectedSources);
            setSelectAll(selectedSources.length === newSources.length);
            setSourceListSelector(selectedSources)
            return newSources;
        });
    };


    const handleFileChanges = async (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFileNames(selectedFiles.map(file => file.name));
        setIsLoading(true);
        setIsOpenUploadFile(false);
    
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
    
          try {
            const response = await axios.post(`http://127.0.0.1:8000/notebooks/${notebookId}/files/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              withCredentials: true
            });
    
            if (response.status === 200) {
              setUploadStatus(prevStatus => ({
                ...prevStatus,
                [file.name]: 'completed'
              }));
              fetchAllSourcesAgain();
            } else {
              setUploadStatus(prevStatus => ({
                ...prevStatus,
                [file.name]: 'failed'
              }));
              alert(`Failed to upload file: ${file.name}`);
            }
          } catch (error) {
            console.error(`Error uploading file: ${file.name}`, error);
            setUploadStatus(prevStatus => ({
              ...prevStatus,
              [file.name]: 'failed'
            }));
            alert(`Error uploading file: ${file.name}`);
          }
        }
    
        setIsLoading(false);
      };
   

    return (
       <>
       {isOpenSource ? (
            <NotebookSource source={sourceSelector} notebookId={notebookId}/>
        ) : (
            <div className={`sidebar ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
                <div className={`sidebar-header ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
                    <span className="bar-sidebar" onClick={handleToggleSidebar}>
                        <i className="fa-solid fa-bars" />
                    </span>
                    <div className={`sidebar-logo  ${isOpenSidebar ? '' : 'not-active'}`}>NotebookVPI </div>
                </div>
                <div className={`section-title  ${isOpenSidebar ? '' : 'not-active'}`}>
                    <span className="sidebar-icon-source">
                        Nguồn
                        <i className="fa-regular fa-circle-user" />
                    </span>
                    <div className="sidebar-add-source" onClick={handleOpenUploadFile}>
                        <i className="fa-regular fa-square-plus" />
                    </div>
                    
                </div>
                <div className={`source-options ${isOpenSidebar ? '' : 'not-active'}`}>
                    <span>Chọn tất cả các nguồn</span>
                    <input
                        type="checkbox"
                        id="customCheckbox"
                        className="custom-checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                    />
                    <label htmlFor="customCheckbox" />
                </div>
                <div className={`scroll-source-area ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
                    {allSources.map((source) => (
                        <div onClick={() => {handleOpenSource(source)}} className={`source-item ${isOpenSidebar ? '' : 'sidebar-shortcut'}`} key={source.sourceId}>
                            <div className="source-item-option ">
                                <i className="fa-solid fa-ellipsis-vertical source-icon-option" />
                                {
                                    (() => {
                                        const fileExtension = source.file_name.split('.').pop().toLowerCase();
                                        switch (fileExtension) {
                                        case 'pdf':
                                            return <i className="fa-regular fa-file-pdf source-icon" style={{color: "red",}}/>;
                                        case 'doc':
                                        case 'docx':
                                            return <i className="fa-regular fa-file-word source-icon"></i>;
                                        case 'drive':
                                            return <i className="fa-brands fa-google-drive source-icon"></i>;
                                        default:
                                            return <i className="fa-regular fa-file source-icon"></i>;
                                        }
                                    })()
                                    }
                                <div className={`source-drop-menu  ${isOpenSidebar ? '' : 'not-active'}`}>
                                    <a href="" className="source-drop-item">
                                        Xóa nguồn
                                    </a>
                                    <a href="" className="source-drop-item">
                                        Sửa tên nguồn
                                    </a>
                                </div>
                            </div>
                            <div className={`source-item-name ${isOpenSidebar ? '' : 'not-active'}`}  >{source.file_name}</div>
                            <div onClick={(e) => e.stopPropagation()} className={`source-item-checkbox ${isOpenSidebar ? '' : 'not-active'}`}>
                                <input
                                    type="checkbox"
                                    id={source.file_id}
                                    className="custom-checkbox"
                                    checked={source.isSelected}
                                    onChange={() => handleSourceSelect(source.file_id)}
                                />
                                <label htmlFor={source.file_id} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className={`source-item ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
                        <div className="source-item-option ">
                            <i class="fa-regular fa-file" style={{color: "#6699ff",}}></i>
                            
                        </div>
                        <div className={`source-item-name ${isOpenSidebar ? '' : 'not-active'}`}>{fileNames}</div>
                        <div className={`source-item-checkbox ${isOpenSidebar ? '' : 'not-active'}`}>
                        <FontAwesomeIcon icon={faSpinner} spin spinReverse style={{color: "#6699ff",}} />
                        </div>
                    </div>
                    )}
                </div>
            </div>
            )}
           
            
                <div className={`file-upload ${isOpenUploadFile ? 'show' : ''}`} onClick={handleCloseUploadFile}>
                    <div className={`file-upload-container ${isOpenUploadFile ? 'show' : ''}`} onClick={(event) => {event.stopPropagation()}}>
                        <div className='file-upload-title'>Tải thư mục lên</div>
                        <label htmlFor="file-upload" className="file-upload-label">
                            <i className="fa fa-cloud-upload" /> Choose a PDF & Docs
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            className="file-upload-input"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChanges}
                            multiple
                        />
                    </div>
                </div>
            

       </>
    )
}

export function getCountSource(){

}

export default NotebookSidebar;