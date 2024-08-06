import React from 'react';
import '../../css/notebook/notebook.css'
import '../../css/notebook/notebook-chat.css'
import '../../css/notebook/notebook-item.css'
import NotebookHeader from './NotebookHeader';
import NotebookMain from './NotebookMain';
import NotebookChat from './NotebookChat';
import { whoAmI } from '../../service/homePageApi';
import { useEffect } from 'react';


function NotebookView({ notebookId }){
    const whoAmICallback = async () => {
        try {
          const data = await whoAmI()
        } catch (e) {
            localStorage.removeItem('session')
            window.location.reload();
        }
      }
    //Hàm kiểm tra server
      useEffect(() => {
          whoAmICallback()
      },[]) 
    
    return (
        <div className="notebook-view">
            <NotebookHeader notebookId={notebookId} />
            <NotebookMain notebookId={notebookId} />
            <NotebookChat notebookId={notebookId} />
        </div>
    )
}

export default NotebookView