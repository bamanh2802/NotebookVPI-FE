import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';
import UserProfile from '../user-profile/UserProfile';
import { updateNotebook } from '../../service/homePageApi';
import { fetchNotebookById } from '../../service/notebookPage';
import UserDetail from '../user-profile/UserDetail';
import { Helmet } from 'react-helmet';

function NotebookHeader({ notebookId }) {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const [notebook, setNotebook] = useState({});
  const [isOpenUserDetail, setIsOpenUserDetail] = useState(false);
  const [notebookName, setNotebookName] = useState('NotebookVPI')

  const handleToggleUserMenu = () => {
    setIsOpenUserMenu(!isOpenUserMenu);
  };

  const fetchNotebookData = async () => {
    try {
      const data = await fetchNotebookById(notebookId);
      setNotebook(data);
      setNewName(data.title);
      setNotebookName(data.title)
    } catch (error) {
      console.error('Error fetching notebook:', error);
    }
  };

  useEffect(() => {
    fetchNotebookData();
  }, [notebookId]);

  const handleNameChange = () => {
    setEditingName(true);
  };

  const handleSaveNameChange = async () => {
    if (!newName.trim()) {
      setNewName(notebook.title);
    } else {
      try {
        // Update the local state first
        setNotebook({ ...notebook, title: newName });
        // Call the API to update the name on the server
        await updateNotebook(notebookId, newName);
        setEditingName(false);
      } catch (error) {
        console.error('Error updating notebook:', error);
        // Revert the local state if the API call fails
        setNotebook(notebook);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{notebookName}</title>
      </Helmet>
      <div className="notebook-header">
        {editingName ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleSaveNameChange}
            autoFocus
            className="notebook-header-change-name"
          />
        ) : (
            <h1 onClick={handleNameChange}>{notebook.title}
              &nbsp;&nbsp;
              <i className="fa-solid fa-pen fa-2xs"/>
            </h1>
          
        )}
        <div className="notebook-icons">
          <span className="user-icon" onClick={handleToggleUserMenu}>
            <i className="fa-regular fa-user"></i>
            <div
              className={`user-profile-block ${isOpenUserMenu ? 'show' : ''}`}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <UserProfile setIsOpenUserDetail={setIsOpenUserDetail} />
            </div>
          </span>
        </div>
      </div>
      <UserDetail
        isOpenUserDetail={isOpenUserDetail ? 'show' : ''}
        closeUserDetail={setIsOpenUserDetail}
      />
    </>
  );
}

export default NotebookHeader;