import React from 'react';
import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'
import NotebookHeader from './NotebookHeader';
import NotebookMain from './NotebookMain';
import NotebookChat from './NotebookChat';


function NotebookView({ notebookId }){
    return (
        <div className="notebook-view">
            <NotebookHeader notebookId={notebookId} />
            <NotebookMain notebookId={notebookId} />
            <NotebookChat notebookId={notebookId} />
        </div>
    )
}

export default NotebookView