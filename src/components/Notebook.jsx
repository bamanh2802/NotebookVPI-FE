import React from 'react';
import { useParams } from 'react-router-dom';
// import '../css/notebook/notebook.css'
import '../css/notebook/notebook-chat.css'
import '../css/notebook/notebook-item.css'
import '../css/notebook/sidebar.css'
import NotebookSidebar from './notebook-components/NotebookSidebar';
import NotebookView from './notebook-components/NotebookView';




function Notebook() {
  const { id } = useParams();

  return (
    <div className="main-content">
      <NotebookSidebar notebookId={id} />
      <NotebookView notebookId={id} />
    </div>
  );
}

export default Notebook;