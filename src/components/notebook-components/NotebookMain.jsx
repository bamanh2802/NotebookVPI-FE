import { useState, useEffect } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'


import RichTextEditor from '../text-edit/RichTextEditor';
import NotebookChatBlock from '../chatbot/NotebookChatBlock';
import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';
import { getNoteByNotebookId, createNewNote, deleteNoteByNotebookId } from '../../service/notebookPage';

function NotebookMain({ notebookId }) {
  const [countSource, setCountSource] = useState(0);
  const [notes, setNotes] = useState([]);
  const [allNotesSelected, setAllNotesSelected] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteName, setSelectedNoteName] = useState(null);
  const [selectedNoteContent, setSelectedNoteContent] = useState(null);
  const [isOpenDeleteMenu, setIsOpenDeleteMenu] = useState(false)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)


  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const selectedNotes = notes.filter((note) => note.isChecked);
  

  useEffect(() => {
    if (data) {
      setCountSource(data.countSource);
    }
  }, [data]);

  useEffect(() => {
    if(selectedNoteId === null) {
      fetchNotes();
    }
  }, [selectedNoteId]);

  const fetchNotes = async () => {
    try {
      const data = await getNoteByNotebookId(notebookId)
      setNotes(data.notes)
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, [notebookId]);

  const handleCreateNote = async () => {
    setIsLoadingCreate(true)
    try {
      const data = await createNewNote(notebookId)
      setIsLoadingCreate(false)
    } catch (error) {
      console.error('Error create note:', error);
    }
    fetchNotes();
  }

  const handleDeleteNote = async () => {
    const checkedNotes = notes.filter((note) => note.isChecked);
    try {
        const deletePromises = checkedNotes.map((note) => 
            deleteNoteByNotebookId(notebookId, note.note_id)
        );
        await Promise.all(deletePromises);
    } catch (error) {
        console.error('Error deleting notes:', error);
    }
    fetchNotes();
    setIsOpenDeleteMenu(false)
}

const handleCloseDeleteMenu = () => {
  setIsOpenDeleteMenu(false)
}


  const handleSelectAll = () => {
    const newAllNotesSelected = !allNotesSelected;
    setAllNotesSelected(newAllNotesSelected);
    setNotes(
      notes.map((note) => ({
        ...note,
        isChecked: newAllNotesSelected,
      }))
    );
  };

  const handleNoteCheck = (noteId) => {
    setNotes(
      notes.map((note) =>
        note.note_id === noteId
          ? { ...note, isChecked: !note.isChecked }
          : note
      )
    );
    
  };

  const closeTextEditor = () => {
    fetchNotes()
    setSelectedNoteId(null);
  };

  const handleNoteClick = (noteId, name, content) => {
    setSelectedNoteId(noteId);
    setSelectedNoteName(name);
    setSelectedNoteContent(content);
    setIsActive(true)
  };

const anyNotesSelected = notes.some((note) => note.isChecked);
const allNotesSelectedState = notes.length > 0 && notes.every((note) => note.isChecked);

return (
  <div className="notebook-content">
    <div className="notebook-content-header">
      <div className="notebook-header-add-note" onClick={handleCreateNote}>
        {isLoadingCreate ? (<FontAwesomeIcon icon={faCircleNotch} spin/>) : (
          <i className="fa-regular fa-note-sticky" /> 
        )}
        &nbsp;Thêm ghi chú 
      </div>
      {anyNotesSelected && (
        <div className="notebook-header-delete-note active" onClick={() => (setIsOpenDeleteMenu(true))}>
          <i className="fa-regular fa-note-sticky" /> Xóa ghi chú
        </div>
      )}
      {!allNotesSelectedState && (
        <div className="notebook-header-tickall" onClick={handleSelectAll}>
          <i className="fa-solid fa-check" /> Chọn tất cả
        </div>
      )}
      {allNotesSelectedState && (
        <div className="notebook-header-untickall active" onClick={handleSelectAll}>
          <i className="fa-solid fa-xmark"></i> Bỏ chọn tất cả
        </div>
      )}
    </div>
    <div className="notebook-content-main">
      {notes.map((note) => (
        <div
          className={`notebook-item ${note.isChecked ? 'ischecked' : ''}`}
          key={note.note_id}
          onClick={(event) => {
            if (!event.target.closest('.ticknote')) {
              handleNoteClick(note.note_id, note.title, note.content);
            }
          }}
        >
          <div className={`ticknote ${!note.isChecked ? '' : 'active'}`}>
            <input
              type="checkbox"
              id={`note${note.note_id}`}
              className="custom-checkbox checkedbox"
              checked={note.isChecked}
              onChange={(event) => {
                event.stopPropagation();
                handleNoteCheck(note.note_id);
              }}
            />
            <label htmlFor={`note${note.note_id}`} />
          </div>
          <div className="notebook-item-header">
            <div className="notebook-save-from">
              <i className="fa-regular fa-message" />
              Câu trả lời đã lưu
            </div>
            <div className="notebook-item-name">{note.title}</div>
          </div>
          <div className="notebook-item-content">{note.content}</div>
          <div className="notebook-item-footer" />
        </div>
      ))}
    </div>

    <NotebookChatBlock notebookId={notebookId} selectedNotes={selectedNotes} countSource={countSource} />

        <RichTextEditor
        notebookId={notebookId}
        noteId={selectedNoteId}
        name={selectedNoteName}
        content={selectedNoteContent}
        setSelectedNoteId={setSelectedNoteId}
        isOpen={selectedNoteId !== null ? 'show' : ''}
      />
      <div className={`background-shadow ${selectedNoteId ? 'show' : ''}`} onClick={closeTextEditor}></div>
      
      <div className={`notebook-delete-block ${isOpenDeleteMenu ? 'show' : ''}`} onClick={handleCloseDeleteMenu}>
      <div className='notebook-delete' onClick={(event) => {event.stopPropagation()}}>
        <div className='notebook-delete-name'>Xoá các ghi chú đã chọn?</div>
        <div className='notebook-delete-footer'>
          <button className='notebook-delete-cancel' onClick={handleCloseDeleteMenu}>Hủy</button>
          <button className='notebook-delete-confirm' onClick={handleDeleteNote}>Xóa</button>
        </div>

      </div>
    </div>
  </div>
);
}


export default NotebookMain;