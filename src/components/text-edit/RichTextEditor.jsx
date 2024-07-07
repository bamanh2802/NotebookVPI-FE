import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import '../text-edit/text-editor.css'
import 'react-quill/dist/quill.snow.css'; // Import CSS cho React Quill

const CHARACTER_LIMIT = 2000;

function RichTextEditor({ noteId, name, content, setSelectedNoteId }) {
  const [editorContent, setEditorContent] = useState(content);
  const [editorName, setEditorName] = useState(name);
  const [isNotActive, setIsNotActive] = useState(false); // New state variable
  const [characterCount, setCharacterCount] = useState(content.length);

  const handleChangeContent = (value) => {
    if (value.length <= CHARACTER_LIMIT) {
      setEditorContent(value);
      setCharacterCount(value.length);
      // Gọi api sửa content
    }
  };

  const handleNameChange = (event) => {
    setEditorName(event.target.value);
    // Gọi api sửa tên
  };

  const handleExitClick = () => {
    setIsNotActive(!isNotActive); 
    setSelectedNoteId(null);
  };

  return (
    <div className={`rich-text-editor text-note-input ${isNotActive ? 'not-active' : ''}`}>
      <div className='text-editor-header'>
        <div className='text-editor-header-content'>
          <input
            type="text"
            className='note-header-name'
            value={editorName}
            onChange={handleNameChange}
          />
          <div className='note-header-type'>Ghi chú do con người viết</div>
        </div>
        <div className='text-editor-header-exit' onClick={handleExitClick}>
          <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
        </div>
      </div>
      <ReactQuill
        className='text-editor-main'
        value={editorContent}
        onChange={handleChangeContent}
        placeholder=""
        modules={{
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['clean']
          ],
        }}
        formats={[
          'header', 'font', 'size',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet', 'indent'
        ]}
      />
      <div className='character-count'>
        {characterCount}/{CHARACTER_LIMIT} 
      </div>
    </div>
  );
}

export default RichTextEditor;
