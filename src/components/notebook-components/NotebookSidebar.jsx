import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import NotebookSource from './NotebookSource';


import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'

function NotebookSidebar({ notebookId }) {
    const [allSources, setAllSources] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [countSource, setCountSource] = useState(0);
    const [sourceSelector, setSouceSelector] = useState()

    const dispatch = useDispatch();
    const isOpenSidebar = useSelector((state) => state.isOpenSidebar);
    const isOpenSource = useSelector((state) => state.isOpenSource)

    const data = { 
        notebookId: notebookId,
        countSource: countSource
    };

    useEffect(() => {
        dispatch({ type: 'UPDATE_DATA', payload: data });
    }, [dispatch, data]);


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


    useEffect(() => {
        async function fetchAllSources() {
            try {
                const response = await fetch(`http://localhost:3000/get-all-sources/${notebookId}`);
                const data = await response.json();
                setAllSources(data.map(source => ({ ...source, isSelected: false })));
            } catch (error) {
                console.error('Error fetching notebooks:', error);
            }
        }
        fetchAllSources();
    }, [notebookId]);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setAllSources(prevSources => prevSources.map(source => ({ ...source, isSelected: !selectAll })));
        if(!selectAll){
            setCountSource(allSources.length)
        } else {
            setCountSource(0)
        }

    };

    
    const handleSourceSelect = (sourceId) => {
        setAllSources(prevSources => prevSources.map(source => (
            source.sourceId === sourceId
                ? { ...source, isSelected: !source.isSelected }
                : source
        )));
        const selectedSources = allSources.map(source => source.sourceId === sourceId ? { ...source, isSelected: !source.isSelected } : source).filter(source => source.isSelected);
        setCountSource(selectedSources.length)
        setSelectAll(selectedSources.length === allSources.length);
    };
    
    return (
       <>
       {isOpenSource ? (
            <NotebookSource source={sourceSelector}/>
       ) : (
        <div className={`sidebar ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
            <div className={`sidebar-header ${isOpenSidebar ? '' : 'sidebar-shortcut'}`}>
                <span className="bar-sidebar" onClick={handleToggleSidebar}>
                    <i className="fa-solid fa-bars" />
                </span>
                <div className={`sidebar-logo  ${isOpenSidebar ? '' : 'not-active'}`}>NotebookPVI </div>
            </div>
            <div className={`section-title  ${isOpenSidebar ? '' : 'not-active'}`}>
                <span className="sidebar-icon-source">
                    Nguồn
                    <i className="fa-regular fa-circle-user" />
                </span>
                <div className="sidebar-add-source">
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
                    <div className={`source-item ${isOpenSidebar ? '' : 'sidebar-shortcut'}`} key={source.sourceId}>
                        <div className="source-item-option ">
                            <i className="fa-solid fa-ellipsis-vertical source-icon-option" />
                            {source.type === 'pdf' ? (
                                <i className="fa-regular fa-file-pdf source-icon" />
                            ) : source.type === 'drive' ? (
                                <i className="fa-brands fa-google-drive source-icon"></i>
                            ) : source.type === 'doc' ? (
                                <i className="fa-regular fa-file-word source-icon"></i>
                            ) : (
                                <i className="fa-regular fa-file source-icon"></i>
                            )}
                            <div className={`source-drop-menu  ${isOpenSidebar ? '' : 'not-active'}`}>
                                <a href="" className="source-drop-item">
                                    Xóa nguồn
                                </a>
                                <a href="" className="source-drop-item">
                                    Sửa tên nguồn
                                </a>
                            </div>
                        </div>
                        <div className={`source-item-name ${isOpenSidebar ? '' : 'not-active'}`}  onClick={() => {handleOpenSource(source)}}>{source.name}</div>
                        <div className={`source-item-checkbox ${isOpenSidebar ? '' : 'not-active'}`}>
                            <input
                                type="checkbox"
                                id={source.sourceId}
                                className="custom-checkbox"
                                checked={source.isSelected}
                                onChange={() => handleSourceSelect(source.sourceId)}
                            />
                            <label htmlFor={source.sourceId} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
       )}
       </>
    )
}


export function getCountSource(){

}



export default NotebookSidebar;