import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';
import UserProfile from '../user-profile/UserProfile';
import { fetchNotebookById } from '../../service/notebookPage';
import UserDetail from '../user-profile/UserDetail';

function NotebookHeader({ notebookId }) {
    const [notebookInfo, setNotebookInfo] = useState({});
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
    const [noteBook, setNotebook] = useState({})
    const [isOpenUserDetail, setIsOpenUserDetail] = useState(false)

    const handleToggleUserMenu = () => {
      setIsOpenUserMenu(!isOpenUserMenu)
    }

    const fetchNotebooks = async () => {
      try {
        const data = await fetchNotebookById(notebookId);
        setNotebook(data);
        
      } catch (error) {
        console.error('Error fetching notebooks:', error);
      }
    }
    useEffect(() => {
      fetchNotebooks()
    }, []);
  
    const handleNameChange = () => {
      setEditingName(true);
    };
  
    const handleSaveNameChange = async () => {
        console.log(newName)
      try {
        const response = await fetch(`http://localhost:3000/update-notebook/${notebookId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newName })
        });

        if (response.ok) {
          const updatedNotebook = await response.json();
          setNotebookInfo(updatedNotebook);
        } else {
          console.error('Error updating notebook name');
        }
      } catch (error) {
        console.error('Error updating notebook name:', error);
      }

      setEditingName(false);
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
              <div className={`user-profile-block ${isOpenUserMenu ? 'show' : ''}`} onClick={(event) => {event.stopPropagation()}} > 
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
