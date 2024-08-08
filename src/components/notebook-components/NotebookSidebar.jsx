import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NotebookSource  from './NotebookSource';
import { fetchSourceNotebook, deleteFileById, renameFileNameById, uploadNewFile } from '../../service/notebookPage';
import Lottie from 'lottie-react';

import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'
import loadingAnimation from '../../svg/loading.json'
import loadingUpload from '../../svg/upload.json'


function NotebookSidebar({ notebookId }) {
    const [allSources, setAllSources] = useState([]);
    const [selectAll, setSelectAll] = useState(true); // Set selectAll to true by default
    const [countSource, setCountSource] = useState([]);
    const [sourceSelector, setSouceSelector] = useState()
    const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
    const [fileNames, setFileNames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sourceListSelector, setSourceListSelector] = useState([])
    const [uploadStatus, setUploadStatus] = useState({});
    const [isEdittingName, setIsEdittingName] = useState(false)
    const [newFileName, setNewFileName] = useState('');
    const [selectedSource, setSelectedSource] = useState()
    const [isLoadingDelete, setIsLoadingDelete] = useState(false)
    const [countSourceNewUp, setCountSourceNewUp] = useState(0)
    const [loadingStates, setLoadingStates] = useState({});


    const dispatch = useDispatch();
    const isOpenSidebar = useSelector((state) => state.isOpenSidebar);
    const isOpenSource = useSelector((state) => state.isOpenSource)
    const navigate = useNavigate()


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
    }, [allSources, dispatch])
    useEffect(() => {
        if(allSources.length === countSource.length){
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
        if(countSource.length === 0) {
            setSelectAll(false)
        }
    }, [countSource,    allSources])


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

    const handleBackToHomePage = () => {
        navigate('/')
    }

    const handleDeleteFile = async (source, event) => {
        setIsLoadingDelete(true)
        setLoadingStates((prev) => ({ ...prev, [source.file_id]: true }));
        event.preventDefault();
        event.stopPropagation();
        try {
            const data = await deleteFileById(notebookId, source.file_id)
            fetchAllSourcesAgain()
            setIsLoadingDelete(false)
        } catch (e) {
            setLoadingStates((prev) => ({ ...prev, [source.file_id]: false }));
            console.log(e)
            alert('Something Went Wrong')
        }
    }

    const handleChangeFileName = async (source, event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isEdittingName || selectedSource.file_id !== source.file_id) {
            const fileNameWithoutExt = source.file_name.replace(/\.pdf$/, '');
            setIsEdittingName(true);
            setNewFileName(fileNameWithoutExt);
            setSelectedSource(source);
        }
    }

      const handleRenameChange = (e) => {
        setNewFileName(e.target.value);
    };

    const handleRenameBlur = async (e, source) => {
        setIsEdittingName(false);
        const updatedFileName = `${newFileName}.pdf`;
        if (newFileName !== selectedSource.file_name) {
            try {
                const data = await renameFileNameById(notebookId, selectedSource.file_id, updatedFileName)
                fetchAllSourcesAgain()
            } catch (e) {
                console.log(e)
            }
        }
    };



    const fetchAllSourcesAgain = async () => {
        try {
          const data = await fetchSourceNotebook(notebookId);
          console.log(data);
      
          if (data.length === 0) {
            setIsOpenUploadFile(true);
          }
      
          const dataSort = data.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
          
          // Cập nhật nguồn
          const updatedSources = dataSort.map(source => {
            console.log(source);
            const found = sourceListSelector.find(s => s.file_id === source.file_id);
            
            // return {
            //   ...source,
            //   isSelected: found ? found.isSelected : true, // Giữ trạng thái của các tệp đã có, các tệp mới sẽ được chọn mặc định
            // };
            return {
                ...source,
                isSelected: found !== undefined, // true nếu file có trong sourceListSelector, ngược lại là false
              };
          });
          console.log(sourceListSelector)
          const selectedSources = updatedSources.filter(source => source.isSelected);
      
          console.log(updatedSources);
          setAllSources(updatedSources);
          setSourceListSelector(selectedSources);
          setCountSource(selectedSources);
        } catch (error) {
          console.log('Get source Error: ', error);
        }
      };
      
      const addTempSource = (tempSource) => {
        setAllSources(prevSources => [...prevSources, tempSource]);
      }

      
    

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
        setCountSourceNewUp(selectedFiles)
        setIsLoading(true);
        setIsOpenUploadFile(false);
        let fileRender = selectedFiles.map(file => file.name)
        console.log(selectedFiles)
    
        for (const file of selectedFiles) {
          const formData = new FormData();
          formData.append('file', file);
    
          try {
            const response = await uploadNewFile(notebookId, formData)
            if (response.status === 200) {
              setUploadStatus(prevStatus => ({
                ...prevStatus,
                [file.name]: 'completed'
              }));
              setFileNames(fileRender.filter(fileName => fileName !== response.data.file_name))
              fileRender = fileRender.filter(fileName => fileName !== response.data.file_name)
              addTempSource({
                file_id: `tempid${response.data.file_name}`,
                file_name: `${response.data.file_name}`,
                isSelected: false,
                notebook_id: notebookId,
                uploaded_at: Date()
              })
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
        fetchAllSourcesAgain();

    
        setIsLoading(false);
      };
   

    return (
       <>
       <div id="overlay" className={`${isLoading ? 'enable' : ''}`}>
            <Lottie
                animationData={loadingAnimation}
                loop
                autoPlay
                style={{
                    width: 100,
                    height: 100,
                }}
            />
        </div>
       {isOpenSource ? (
            <NotebookSource source={sourceSelector} notebookId={notebookId}/>
        ) : (
            <div className={`sidebar ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
                <div className={`sidebar-header ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
                    <span className="bar-sidebar" onClick={handleToggleSidebar}>
                        <i className="fa-solid fa-bars" />
                    </span>
                    <div onClick={handleBackToHomePage} className={`sidebar-logo  ${isOpenSidebar ? '' : 'not-active'}`}>NotebookVPI </div>
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
                                    <a href="" className="source-drop-item"  onClick={(e) => handleDeleteFile(source, e)}>
                                        Xóa nguồn
                                    </a>
                                    <a href="" className="source-drop-item" onClick={(e) => handleChangeFileName(source, e)}>
                                        Sửa tên nguồn
                                    </a>
                                </div>
                            </div>
                           <div className={`source-item-name ${isOpenSidebar ? '' : 'not-active'}`}>
                                {isEdittingName && selectedSource.file_id === source.file_id ? (
                                <input
                                    type="text"
                                    value={newFileName}
                                    onChange={handleRenameChange}
                                    onBlur={(e, source) => handleRenameBlur(e, source)}
                                    autoFocus
                                    onClick={(e) => (e.stopPropagation())}
                                />
                                ) : (
                                source.file_name
                                )}
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className={`source-item-checkbox ${isOpenSidebar ? '' : 'not-active'}`}>
                               {loadingStates[source.file_id] ? (
                                <Lottie
                                animationData={loadingAnimation}
                                loop
                                autoPlay
                                colorMap={{
                                  "color3": "#0000FF"  // Thay màu xanh dương
                                }}
                                style={{
                                  width: 24,
                                  height: 24,
                                }}
                              />
                               ) : (
                                <>
                                    <input
                                    type="checkbox"
                                    id={source.file_id}
                                    className="custom-checkbox"
                                    checked={source.isSelected}
                                    onChange={() => handleSourceSelect(source.file_id)}

                                    />
                                    <label htmlFor={source.file_id} />
                                </>
                               )}
                            </div>
                        </div>
                    ))}
                    {isLoading && fileNames.map((fileName, index) => (
                    <div key={index} className={`source-item ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
                        <div className="source-item-option">
                            <i className="fa-regular fa-file" style={{ color: "#6699ff" }}></i>
                        </div>
                        <div className={`source-item-name ${isOpenSidebar ? '' : 'not-active'}`}>
                            {fileName}
                        </div>
                        <div className={`source-item-checkbox ${isOpenSidebar ? '' : 'not-active'}`}>
                            <Lottie
                                animationData={loadingAnimation}
                                loop
                                autoPlay
                                colorMap={{
                                    "color3": "#0000FF" // Thay màu xanh dương
                                }}
                                style={{
                                    width: 24,
                                    height: 24,
                                }}
                            />
                        </div>
                    </div>
                ))}
                </div>
            </div>
            )}
           
            
                <div className={`file-upload ${isOpenUploadFile ? 'show' : ''}`} onClick={handleCloseUploadFile}>
                    <div className={`file-upload-container ${isOpenUploadFile ? 'show' : ''}`} onClick={(event) => {event.stopPropagation()}}>
                        <div className='file-upload-title'>Tải thư mục lên</div>
                        <label htmlFor="file-upload" className="file-upload-label">
                            <i className="fa fa-cloud-upload" /> Choose a PDF File to ask for knowledge
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            className="file-upload-input"
                            accept=".pdf"
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