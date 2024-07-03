import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';

function NotebookHeader({ notebookId }) {
    const [notebookInfo, setNotebookInfo] = useState({});
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState('');
  
    useEffect(() => {
      async function fetchNotebookInfo() {
        try {
          const response = await fetch(`http://localhost:3000/get-all-info-by-id/${notebookId}`);
          const data = await response.json();
          setNotebookInfo(data);
          setNewName(data.name);
        } catch (error) {
          console.error('Error fetching notebook info:', error);
        }
      }
      fetchNotebookInfo();
    }, [notebookId]);
  
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
          <h1 onClick={handleNameChange}>{notebookInfo.name}</h1>
        )}
        <div className="notebook-icons">
          <span className="icon">🌙</span>
          <button className="share-button">Chia sẻ</button>
          <span className="profile">M</span>
        </div>
      </div>
    );
}

export default NotebookHeader;
