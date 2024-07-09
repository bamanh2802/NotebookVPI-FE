import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllNotebooks, createNotebook, deleteNotebook, updateNotebook } from '../../service/homePageApi';

import '../../css/homepage/homepage.css';
import '../../css/color.css';
import '../../css/homepage/loadingpage.css'

function HomePage() {
  const [notebooks, setNotebooks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedNotebookId, setSelectedNotebookId] = useState(null);
  const [selectedNotebookName, setSelectedNotebookName] = useState(null);
  const [dropdownClass, setDropdownClass] = useState('');
  const [isOpenChangeMenu, setIsOpenChangeMenu] = useState(false)
  const [isOpenDeleteMenu, setIsOpenDeleteMenu] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isChatOpen = useSelector((state) => state.isChatOpen);
  const isOpenSource = useSelector((state) => state.isOpenSource);
  const isTutorialOpen = useSelector((state) => state.isTutorialOpen);
  
  const [isLoadingNotebook, setIsLoadingNotebook] = useState(false);

  const toggleDropdown = (event, notebookId, notebookName) => {
    event.stopPropagation();
    if (selectedNotebookId === notebookId && isDropdownOpen) {
      setDropdownClass('fade-out');
      setTimeout(() => {
        setIsDropdownOpen(false);
        setDropdownClass('');
      }, 300); // Thời gian của animation
    } else {
      setSelectedNotebookId(notebookId);
      setSelectedNotebookName(notebookName)
      setDropdownClass('fade-in');
      setIsDropdownOpen(true);
    }
  };

  const handleEdit = (notebookId) => {
    console.log('Edit notebook', notebookId);
    // toggleDropdown();
  };

  const handleOpenDeleteMenu = (notebookId) => {
    setIsOpenDeleteMenu(true)
  }
  const handleCloseDeleteMenu = () => {
    setIsOpenDeleteMenu(false)
  }
  const handleOpenChangeMenu = (notebookId) => {
    setIsOpenChangeMenu(true)
  }
  const handleCloseChangeMenu = () => {
    setIsOpenChangeMenu(false)
  }

  const handleDelete = async () => {
    try {
      const data = await deleteNotebook(selectedNotebookId);

      console.log(data);
    } catch (error) {
      console.error('Error delete notebooks:', error);
    }
    setIsOpenDeleteMenu(false)
    fetchNotebooks()
    // toggleDropdown();
  };


  const fetchNotebooks = async () => {
    try {
      const data = await fetchAllNotebooks();
      setNotebooks(data);
      
    } catch (error) {
      console.error('Error fetching notebooks:', error);
    }
  }
  const handleCreateNotebook = async () => {
    try {
      const data = await createNotebook();
      console.log(data);
    } catch (error) {
      console.error('Error create notebooks:', error);
    }
    fetchNotebooks()

  };

  const handleChangeName = async () => {
    console.log(selectedNotebookId, selectedNotebookName)
    try {
      const data = await updateNotebook(selectedNotebookId, selectedNotebookName);
    } catch (error) {
      console.error('Error update notebooks:', error);

    }
    fetchNotebooks()
    setIsOpenChangeMenu(false)

  }

  useEffect(() => {
      fetchNotebooks();
      setTimeout(() => {
        setIsLoadingNotebook(true)
      }, 1000)
  }, []);

  const getDateOnly = (dateTimeString) => {
    const dateTimeObj = new Date(dateTimeString);
    return dateTimeObj.toLocaleDateString();
  };


  const handleNotebookClick = (id) => {
    navigate(`/notebook/${id}`);
    if (!isChatOpen) {
      dispatch({ type: 'TOGGLE_CHAT' });
    }
    if (isOpenSource) {
      dispatch({ type: 'TOGGLE_SOURCE' });
    }
    if (isTutorialOpen) {
      dispatch({ type: 'TOGGLE_TUTORIAL' });
    }
  };

  const handleClickOutside = () => {
    if (isDropdownOpen) {
      setDropdownClass('fade-out');
      setTimeout(() => {
        setIsDropdownOpen(false);
        setDropdownClass('');
      }, 300);
    }
  };

  useEffect(() => {
    const handleMouseEvent = (event) => {
      if (event.button === 4) {
        if (!isChatOpen) {
          dispatch({ type: 'TOGGLE_CHAT' });
        }
        if (isOpenSource) {
          dispatch({ type: 'TOGGLE_SOURCE' });
        }
        if (isTutorialOpen) {
          dispatch({ type: 'TOGGLE_TUTORIAL' });
        }
      }
    };

    const mouseEvents = ['mousedown'];

    mouseEvents.forEach((eventType) => {
      document.addEventListener(eventType, handleMouseEvent);
    });

    return () => {
      mouseEvents.forEach((eventType) => {
        document.removeEventListener(eventType, handleMouseEvent);
      });
    };
  }, []);

  return (
    <div>
      <div id="home-page" onClick={handleClickOutside}>
        <div className="header">
          <div className="logo">NotebookVPI</div>
          <div className="icons">
            <span className="icon">🌙</span>
          </div>
        </div>

        {isLoadingNotebook ? (
            <div className="content-container">
              <div className="content">
                <h2 className="content-title">Sổ tay</h2>
                <div className="notebook-grid">
                  <div className="notebook new" onClick={handleCreateNotebook}>
                    <div className="plus">+</div>
                    <div className="label">Sổ tay mới</div>
                  </div>
                  {notebooks.map((notebook) => (
                    <div
                      key={notebook.notebook_id}
                      id={notebook.notebook_id}
                      className="notebook"
                      onClick={() => handleNotebookClick(notebook.notebook_id)}
                    >
                      <div className="notebook-header-homepage">
                        <div className="notebook-icon">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/330/330705.png"
                            alt=""
                          />
                        </div>
                        <span
                          className="notebook-option"
                          onClick={(event) => toggleDropdown(event, notebook.notebook_id, notebook.title)}
                        >
                          <i className="fa-solid fa-ellipsis-vertical" />
                          {selectedNotebookId === notebook.notebook_id && isDropdownOpen && (
                            <div className={`notebook-option-dropdown ${dropdownClass}`}>
                              <div
                                className="notebook-option-item"
                                onClick={() => handleOpenChangeMenu(notebook.notebook_id)}
                              >
                                <i className="fa-solid fa-pen-to-square"></i>&nbsp;&nbsp;Edit
                              </div>
                              <div
                                className="notebook-option-item"
                                onClick={() => handleOpenDeleteMenu(notebook.notebook_id)}
                              >
                                <i className="fa-solid fa-trash-can"></i>&nbsp;&nbsp;Delete
                              </div>
                            </div>
                          )}
                        </span>
                      </div>
                      <span className="notebook-name-homepage">{notebook.title}</span>
                      <div className="notebook-detail">
                        <span className="notebook-date">{getDateOnly(notebook.created_at)}</span>
                        <span>.</span>
                        <span className="notebook-count-source">{notebook.sourceCount} nguồn</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
              {isOpenDeleteMenu && (
                <div className='notebook-delete-block' onClick={handleCloseDeleteMenu}>
                <div className='notebook-delete' onClick={(event) => {event.stopPropagation()}}>
                  <div className='notebook-delete-name'>Xóa Unititled notebook?</div>
                  <div className='notebook-delete-footer'>
                    <button className='notebook-delete-cancel' onClick={handleCloseDeleteMenu}>Hủy</button>
                    <button className='notebook-delete-confirm' onClick={handleDelete}>Xóa</button>
                  </div>

                </div>
              </div>
              )}




              
              {isOpenChangeMenu && (
                <div className='notebook-change-block' onClick={handleCloseChangeMenu}>
                <div className='notebook-change' onClick={(event) => {event.stopPropagation()}}>
                  <div className='notebook-change-main'> 
                    <div className='notebook-avatar'> <img src="https://cdn-icons-png.flaticon.com/512/330/330705.png" alt="" /></div>
                    <div className='input-container'>
                      <label for="notebook-title" class="notebook-label" htmlFor="">Tiêu đề của sổ tay</label>
                      <input 
                        className='notebook-change-input' 
                        value={selectedNotebookName} 
                        onChange={(e) => setSelectedNotebookName(e.target.value)}
                        type="text" />
                    </div>
                  </div>
                  <div className='notebook-change-footer'>
                    <button className='notebook-change-cancel' onClick={handleCloseChangeMenu}>Hủy</button>
                    <button className='notebook-change-confirm' onClick={handleChangeName}>Lưu</button>
                  </div>
                </div>
              </div>
              )}



            </div> 
        ) : (
          <div className='loading-page'>
          <div className="book">
            <div className="inner">
              <div className="left"></div>
              <div className="middle"></div>
              <div className="right"></div>
            </div>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <a className="dribbble" href="https://dribbble.com/shots/7199149-Book-Loader" target="_blank"></a>
        </div>
        )}


      
       
      </div>
    </div>
    
  );
}

export default HomePage;
