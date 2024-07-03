import { useState, useEffect } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import RichTextEditor from '../text-edit/RichTextEditor';
import NotebookChatBlock from '../chatbot/NotebookChatBlock';
import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';

function NotebookMain({ notebookId }) {
  const [countSource, setCountSource] = useState(0);
  const [notes, setNotes] = useState([]);
  const [allNotesSelected, setAllNotesSelected] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [selectedNoteName, setSelectedNoteName] = useState(null);
  const [selectedNoteContent, setSelectedNoteContent] = useState(null);

  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
  const selectedNotes = notes.filter((note) => note.isChecked);
  

  useEffect(() => {
    if (data) {
      setCountSource(data.countSource);
    }
  }, [data]);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch(`http://localhost:3000/get-all-info-by-id/${notebookId}`);
        const data = await response.json();
        setNotes(data.notes);
      } catch (error) {
        console.error('Error fetching notebooks:', error);
      }
    }
    fetchNotes();
  }, [notebookId]);

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
        note.noteId === noteId
          ? { ...note, isChecked: !note.isChecked }
          : note
      )
    );
  };

  const closeTextEditor = () => {
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
      <div className="notebook-header-add-note">
        <i className="fa-regular fa-note-sticky" /> Thêm ghi chú
      </div>
      {anyNotesSelected && (
        <div className="notebook-header-delete-note active">
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
          key={note.noteId}
          onClick={(event) => {
            if (!event.target.closest('.ticknote')) {
              handleNoteClick(note.noteId, note.name, note.content);
            }
          }}
        >
          <div className={`ticknote ${!note.isChecked ? '' : 'active'}`}>
            <input
              type="checkbox"
              id={`note${note.noteId}`}
              className="custom-checkbox checkedbox"
              checked={note.isChecked}
              onChange={(event) => {
                event.stopPropagation();
                handleNoteCheck(note.noteId);
              }}
            />
            <label htmlFor={`note${note.noteId}`} />
          </div>
          <div className="notebook-item-header">
            <div className="notebook-save-from">
              <i className="fa-regular fa-message" />
              Câu trả lời đã lưu
            </div>
            <div className="notebook-item-name">{note.name}</div>
          </div>
          <div className="notebook-item-content">{note.content}</div>
          <div className="notebook-item-footer" />
        </div>
      ))}
    </div>

    <NotebookChatBlock notebookId={notebookId} selectedNotes={selectedNotes} countSource={countSource} />

    {selectedNoteId !== null && (
      <RichTextEditor
        noteId={selectedNoteId}
        name={selectedNoteName}
        content={selectedNoteContent}
        setSelectedNoteId={setSelectedNoteId}
      />
    )}
    {selectedNoteId !== null && (
      <div className="background-shadow" onClick={closeTextEditor}></div>
    )}
  </div>
);
}


export default NotebookMain;