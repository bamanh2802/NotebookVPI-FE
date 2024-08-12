import axios from 'axios';
import qs from 'qs';

import API_URL from '../config/apiPath';


export async function fetchNotebookById(notebookId) {

    const response = await axios.get(`${API_URL}/notebooks/${notebookId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
  
    return response.data;
  }

export async function fetchSourceNotebook(notebookId) {

const response = await axios.get(`${API_URL}/notebooks/${notebookId}/files`, {
    headers: {
    'Content-Type': 'application/json',
    },
    withCredentials: true
});

return response.data;
}

export async function getNoteByNotebookId(notebookId) {

    const response = await axios.get(`${API_URL}/notebooks/${notebookId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
  
    return response.data;
  }
export async function createNewNote(notebookId, title, content, ref) {
  const references = JSON.stringify(ref)
    const response = await axios.post(`${API_URL}/notebooks/notes/new`, ({
        notebook_id: notebookId,
        title: title,
        content: content,
        references: references
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true
    });
    return response
  }
  
export async function deleteNoteByNotebookId(notebookId, noteId) {
    const response = await axios.post(`${API_URL}/notebooks/${notebookId}/notes/${noteId}/delete`, {},
    {
        headers: {
            'Content-Type': 'application/json',
          },
        withCredentials: true
    })
    return response

}
export async function noteRenameById(notebookId, noteId, newName){
    const response = await axios.post(`${API_URL}/notebooks/${notebookId}/notes/${noteId}/rename?new_title=${newName}`, {
    },
    {
      headers: {
          'Content-Type': 'application/json',
        },
      withCredentials: true
    }
  );
    return response
}

export async function updateContentNote(notebookId, noteId, newContent){
  const response = await axios.post(
    `${API_URL}/notebooks/${notebookId}/notes/${noteId}/update`,
    { new_content: newContent }, 
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
    }
  );
  return response
}


export async function sendMessage(notebookId, content, selected_files) {
  const data = qs.stringify({
    notebook_id: notebookId,
    content: content,
    selected_files: JSON.stringify(selected_files) // Chuyển đổi mảng thành chuỗi JSON
  });

  const response = await axios.post(`${API_URL}/messages/send`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    withCredentials: true
  });

  return response;
}

export async function getContextById(notebookId, fileId) {
  const response = await axios.get(`${API_URL}/notebooks/${notebookId}/files/${fileId}/text`, 
  {
      headers: {
          'Content-Type': 'application/json',
        },
      withCredentials: true
  })
  return response

}

export async function deleteFileById(notebookId, fileId){
  const data = qs.stringify({ file_ids: fileId }); 
  const response = await axios.post(
    `${API_URL}/notebooks/${notebookId}/files/${fileId}/delete`, 
    data,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      withCredentials: true
    }
  );
  return response
}

export async function renameFileNameById(notebookId, fileId, newName) {
  const response = await axios.post(`${API_URL}/notebooks/${notebookId}/files/${fileId}/rename?new_title=${newName}`, {}, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    withCredentials: true
  }
  )
  return response
  }

export async function uploadNewFile(notebookId, formData){
  const response = await axios.post(`${API_URL}/notebooks/${notebookId}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
  return response
}

export async function saveChatHistory(notebookId){
  const response = await axios.post(`${API_URL}/messages/save`, {
    notebook_id: notebookId
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    },
    withCredentials: true
  })
  return response
}

export async function getChatHistory(notebookId){
  const response = await axios.get(`${API_URL}/messages/get/${notebookId}`, {
    headers: {
      'accept': 'application/json'
    },
    withCredentials: true
  })
  return response
}

export async function getChunkIdByFileId(notebookId, fileId) {
  const response = await axios.get(`${API_URL}/notebooks/${notebookId}/files/${fileId}/chunks`, {
    headers: {
      'accept': 'application/json'
    },
    withCredentials: true
  })
  return response
}

export async function sendFeedbackSystem(userId, content) {
const response = await axios.post(`${API_URL}/create_system_feedback`, {
    user_id: userId,
    content: content
  }, {
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    withCredentials: true

  })
    return response
}

export async function sendFeedbackMessage(userId, notebookId, content){
  const response = await axios.post(`${API_URL}/create_message_feedback`, {
    user_id: userId,
    notebook_id: notebookId,
    content: content
  }, {
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    withCredentials: true

  })
    return response
}