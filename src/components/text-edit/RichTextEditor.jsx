import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import '../text-edit/text-editor.css'
import 'react-quill/dist/quill.snow.css'; 
import { noteRenameById } from '../../service/notebookPage';

const CHARACTER_LIMIT = 2000;

const RichTextEditor = ({notebookId, noteId, name, content, setSelectedNoteId, isOpen }) => {
  const [editorContent, setEditorContent] = useState('');
  const [editorName, setEditorName] = useState('');
  const [isNotActive, setIsNotActive] = useState(false);
  const [characterCount, setCharacterCount] = useState('');

  useEffect(() => {
    if(content) {
      setEditorContent(content);
      setCharacterCount(content.length)
    }
  },[content])
  useEffect(() => {
    setEditorName(name)
  },[name])

  const handleChangeContent = (value) => {
    if (value.length <= CHARACTER_LIMIT) {
      setEditorContent(value);
      setCharacterCount(value.length);
      // Gọi api sửa content
    } else {
      // Nếu vượt quá giới hạn, chỉ cập nhật bộ đếm ký tự
      setCharacterCount(value.length);
    }
  };
  const handleNameChange = async (event) => {
    setEditorName(event.target.value);
    try {
      const data = await noteRenameById(notebookId, noteId, event.target.value)
    } catch (error) {
      console.log('Rename Error')
    }
  };

  const handleExitClick = () => {
    setIsNotActive(!isNotActive); 
    setSelectedNoteId(null);
  };
  return (
    <div className={`rich-text-editor text-note-input ${isOpen}`}>
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
      {characterCount > CHARACTER_LIMIT && (
        <div className='character-limit-warning'>
          Bạn đã đạt đến giới hạn ký tự cho phép.
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;
