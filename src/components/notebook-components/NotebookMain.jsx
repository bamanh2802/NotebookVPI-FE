import { useState, useEffect, CSSProperties } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

import FeedbackMessage from '../message/FeedbackMessage';
import HashLoader from "react-spinners/HashLoader";

import RichTextEditor from '../text-edit/RichTextEditor';
import NotebookChatBlock from '../chatbot/NotebookChatBlock';
import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';
import NoteReferences from './NoteReferences';
import { getNoteByNotebookId, createNewNote, deleteNoteByNotebookId } from '../../service/notebookPage';

function NotebookMain({ notebookId }) {
  const [countSource, setCountSource] = useState([]);
  const [notes, setNotes] = useState([]);
  const [allNotesSelected, setAllNotesSelected] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteName, setSelectedNoteName] = useState(null);
  const [selectedNoteContent, setSelectedNoteContent] = useState(null);
  const [isOpenDeleteMenu, setIsOpenDeleteMenu] = useState(false)
  const [isLoadingCreate, setIsLoadingCreate] = useState(false)
  const [isChange, setIsChange] = useState(false)

  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const selectedNotes = notes.filter((note) => note.isChecked);
  const newNoteTemp = useSelector((state) => state.tempNotes)
  const isOpenFeedback = useSelector((state) => state.isFeedbackMessage)
  const isNotify = useSelector((state) => state.isNotify)


  useEffect(() => {
    if (data) {
      setCountSource(data.countSource);
    }
  }, [data]);

  const closeNotify = () => {
    dispatch({
      type: 'TOGGLE_NOTIFY'
      })
  }


  const fetchNotes = async () => {
    try {
      const data = await getNoteByNotebookId(notebookId)
      setNotes(data.notes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
      if (newNoteTemp) {
        setNotes(prevNotes => [
          ...newNoteTemp.filter(note => note.notebookId === notebookId),
          ...prevNotes
        ]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }

  const updateNoteById = async (noteId, name, content) => {
      setNotes((prevNotes) => {
        return prevNotes.map((note) => {
          if (note.note_id === noteId) {
            return { ...note, title: name, content: content };
          }
          return note;
        });
      });
  }


  useEffect(() => {
    fetchNotes();
  }, [notebookId, newNoteTemp]);

  const handleCreateNote = async () => {
    setIsLoadingCreate(true)
    try {
      const data = await createNewNote(notebookId, 'Untitled Note', 'Content', [])
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
    setIsActive(false)
    setSelectedNoteId(null);
    setSelectedNoteName(null);
    setSelectedNoteContent(null);
    if (isChange) {
      fetchNotes()
    }
  };

  const handleNoteClick = (noteId, name, content) => {
    setSelectedNoteId(noteId);
    setSelectedNoteName(name);
    setSelectedNoteContent(content);
  };
  useEffect(() => {
    if (selectedNoteId !== null && selectedNoteName !== null && selectedNoteContent !== null) {
      setIsActive(true);
    }
  }, [selectedNoteId, selectedNoteName, selectedNoteContent]);

  const handleCloseFeedback = () => {
    dispatch({
      type: 'TOGGLE_FEEDBACK'
    })
  }



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
          <i class="fa-regular fa-trash-can"/> Xóa ghi chú
        </div>
      )}
      {!allNotesSelectedState && (
        <div className="notebook-header-tickall" onClick={handleSelectAll}>
          <i className="fa-solid fa-check" /> Chọn tất cả
        </div>
      )}
      {allNotesSelectedState && (
        <div className="notebook-header-untickall active" onClick={handleSelectAll}>
          <i className="fa-solid fa-xmark"/> Bỏ chọn tất cả
        </div>
      )}
    </div>
    <div className="notebook-content-main">
      {notes.map((note) => (
        <div
          className={`notebook-item ${note.isChecked ? 'ischecked' : ''} ${note.content === 'Đang tạo...' ? 'disable' : ''}`}
          key={note.note_id}
          onClick={(event) => {
            if (!event.target.closest('.ticknote')) {
              handleNoteClick(note.note_id, note.title, note.content);
            }
          }}
        >
         {note.content === 'Đang tạo...' ? (
          <div className='loading-note'>
            <HashLoader
              color="#0085ff"
              size={30}
            />
          </div>
         ) : (
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
         )}
          <div className="notebook-item-header">
            <div className="notebook-save-from">
              <i className="fa-regular fa-message" />
              Câu trả lời đã lưu
            </div>
            <div className="notebook-item-name">{note.title}</div>
          </div>
          <div className="notebook-item-content" dangerouslySetInnerHTML={{ __html: note.content }} />
          <div className="notebook-item-footer">
              <NoteReferences data={note.references} />
             </div>
        </div>
      ))}
    </div>

    <NotebookChatBlock notebookId={notebookId} selectedNotes={selectedNotes} countSource={countSource} />

        <RichTextEditor
        isChange={setIsChange}
        updateNote={updateNoteById}
        notebookId={notebookId}
        noteId={selectedNoteId}
        name={selectedNoteName}
        content={selectedNoteContent}
        setSelectedNoteId={setSelectedNoteId}
        isOpen={isActive ? 'show' : ''}
        setIsActive={() => (setIsActive(false))}
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
    <div onClick={handleCloseFeedback} className={`feedback-message-container ${isOpenFeedback ? 'show': ''}`}>
        <FeedbackMessage notebookId={notebookId}/>
    </div>

    <div className={`feedback-success-toast ${isNotify ? 'show' : ''}`}>
      Đã gửi ý kiến phản hồi thành công. <span onClick={closeNotify}>Đóng</span>
    </div>
  </div>
);
}


export default NotebookMain;