import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';
import UserProfile from '../user-profile/UserProfile';
import { fetchNotebookById } from '../../service/notebookPage';
import UserDetail from '../user-profile/UserDetail';
import { updateNotebook } from '../../service/homePageApi';

function NotebookHeader({ notebookId }) {
    const [notebookInfo, setNotebookInfo] = useState({});
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
    const [noteBook, setNotebook] = useState({});
    const [isOpenUserDetail, setIsOpenUserDetail] = useState(false);

    const handleToggleUserMenu = () => {
      setIsOpenUserMenu(!isOpenUserMenu);
    };

    const fetchNotebooks = async () => {
      try {
        const data = await fetchNotebookById(notebookId);
        setNotebook(data);
        setNewName(data.title); // Set newName with fetched notebook title
      } catch (error) {
        console.error('Error fetching notebooks:', error);
      }
    };

    useEffect(() => {
      fetchNotebooks();
    }, [notebookId]); // Fetch notebook info when component mounts or notebookId changes

    const handleNameChange = () => {
      setEditingName(true);
    };

    const handleSaveNameChange = async () => {
      if (!newName.trim()) {
        setNewName(noteBook.title); 
      } else {
        try {
          await updateNotebook(notebookId, newName);
          fetchNotebooks(); // Refresh notebook info after updating
        } catch (error) {
          console.error('Error updating notebook:', error);
        }
        setEditingName(false);
      }
    };

    return (
      <>
        <div className="notebook-header">
          {editingName ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleSaveNameChange}
              autoFocus
              className='notebook-header-change-name'
            />
          ) : (
            <h1 onClick={handleNameChange}>{noteBook.title}</h1>
          )}
          <div className="notebook-icons">
            <span className='user-icon' onClick={handleToggleUserMenu}>
              <i className="fa-regular fa-user"></i>
                <div className={`user-profile-block ${isOpenUserMenu ? 'show' : ''}`} onClick={(event) => {event.stopPropagation()}}>
                <UserProfile setIsOpenUserDetail={setIsOpenUserDetail}/>
              </div>
              </span>
          </div>
        </div>
        <UserDetail isOpenUserDetail={isOpenUserDetail ? 'show' : ''} closeUserDetail={setIsOpenUserDetail} />
      </>
    );
}

export default NotebookHeader;
